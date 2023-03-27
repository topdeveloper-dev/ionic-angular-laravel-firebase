import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { File } from '@ionic-native/file/ngx';
import { cl, cl2, IMemory, jsonToString, momentString, showToast, testEmogi } from '../globUtils';
import { AppControl, Authentication, IonUtils, User } from '../glob.module';
import { SymService } from './sym.service';

// import { exit } from 'node:process';
// import { Network } from '@ionic-native/network/ngx';

//const { Network } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DatabaseService implements OnInit, OnDestroy {



  private database: SQLiteObject;
  readonly databaseName: string = 'lovedonesdb.db';
  readonly tableName: string = 'memory';
  readonly databaseCreateTableQuery: string = 'CREATE TABLE IF NOT EXISTS memory( memoryid INTEGER PRIMARY KEY AUTOINCREMENT, id BIGINT, memoryName VARCHAR(100), memoryBody VARCHAR(1000), memoryType VARCHAR(20), videoMemoryPath VARCHAR(200), voiceMemoryPath VARCHAR(200), imageMemoryPath VARCHAR(200), reminder VARCHAR(200), repeatDelivery VARCHAR(200), deliveryDate VARCHAR(200), senderId BIGINT(20), recipientId BIGINT(20), receiverName VARCHAR(30), receiverSurname VARCHAR(30), receiverEmail VARCHAR(30), receiverContactNumber VARCHAR(30),location VARCHAR(200) , viewStatus INT(20), sendStatus INT(11), dateCreated VARCHAR(100), isDeleted INT(11), syncStatus BOOLEAN )';
  readonly databaseDropTableQuery: string = `DROP TABLE IF EXISTS ${this.tableName}`;
  readonly dbOptions: SQLiteDatabaseConfig = {
    name: this.databaseName,
    location: 'default'
  }
  readonly dbFieldNamesArray = ['id', 'memoryName', 'memoryBody', 'memoryType', 'videoMemoryPath', 'voiceMemoryPath', 'imageMemoryPath', 'reminder', 'repeatDelivery', 'deliveryDate', 'senderId', 'recipientId', 'receiverName', 'receiverSurname', 'receiverEmail', 'receiverContactNumber','location', 'viewStatus', 'sendStatus', 'dateCreated', 'isDeleted', 'syncStatus'];
  networkStatus: any;
  networkListener: PluginListenerHandle;

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    private file: File,
    private platform: Platform,
    private user: User,
    private symService: SymService,
    private authentication: Authentication,
    private ionUtils: IonUtils,
    private appControl: AppControl,
  ) {

  }

  async ngOnInit() {

  }

  init(){
    this.platform.ready().then(() => {
      // console.log('Platform Ready!');
      this.networkListener = Network.addListener('networkStatusChange', (status) => {
        // console.log("Network_status_changed", status);
        this.networkStatus = status;
        if(this.networkStatus.connected){
          this.syncToServer();
        }
      });

        // this.dropTable()

      // this.syncMemoryData();
      // this.syncToServer();
      // this.deleteAllFromDb();
      this.checkDBExists()
      // this.createDB();
    }).catch(error => {
      console.log(error);
    })
  }

  renewLocalDB() {
    this.dropTable(tableDropped=>{
     // alert('table dropped ' + tableDropped);
      if(tableDropped){
        this.checkDBExists()
      }
    })
  }

  syncToServer(){
    // cl('syncToServer',123)
    this.getMemories(res=>{
      let MemoryData = jsonToString(res);
      this.appControl.syncMemoriesToServer(MemoryData).then((res: Array<Object>) => {

        if(res.length > 0){

          // cl('Data sychronised')
          this.deleteAllFromDb().then(deleted=>{
            if(deleted){
              this.insertMemories(res).then(inserted=>{
                this.getLatestMemoryId(latestMemory=>{
                  cl('getLatestMemoryId_123', latestMemory)
                  showToast('Data synchronised.')
                })
              })
            }
          })
        }
      })
    })
  }

  async downloadNewMemories() {
    await this.deleteAllFromDb();
    await this.bulkInsertToLocalDb();
  }

  private checkDBExists() {
    this.file.checkFile('default', this.databaseName)
    .then((res)=>{
      this.bulkInsertToLocalDb();
      // cl(`Db Exist: ${res}`)
    }
      // this.loadDevelopers
      )
        .catch(()=>{
          this.createDb();
        }
      );
  }

  onAppLogin(){
    this.bulkInsertToLocalDb();
  }

  bulkInsertToLocalDb(){
    // cl('bulkInsert')
    this.getMemoriesFromServer(memories=>{
      // cl(['getMemoriesfromServer___Length', memories])
      this.getMemories(localData=>{
        // cl(testEmogi, [localData,memories])
        if( localData.length > memories.length){
          // this.checkForDuplicates( localData, memories)
        }

        if( localData.length < memories.length){


        }
          // alert('LocalData Length ' + localData.length);
        if(localData.length == 0){
          this.insertMemories(memories)
        }

      });


    });
  }

  areDifferentByIds(a, b) {
    var addArgs = Array.prototype.slice.call(arguments, 2);
    var props = addArgs.length > 0 ? addArgs : ['id'];
    for(var diff=false, i=0; !diff && i<addArgs.length; i++) {
        diff = a[addArgs[i]] !== b[addArgs[i]];
    }
    return diff;
  }

  checkForDuplicates(localData: any, memories: any) {
    // cl(['getMemoriesfromLocal___Array', localData]);
    // cl(['getMemoriesfromServer___Array', memories])
    const filteredArr = localData.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.deleteAllFromDb();
    if(filteredArr){
    }
    // cl(['Filtrered Memory Object: ', filteredArr])
    this.insertMemories(memories);

    this.getMemories(res=>{
      // cl(res)
    })
  }

  private getMemoriesFromServer(callback){
    this.user.get().then(useRes => {
      try {
        // cl(['user___08.04.2021', useRes])
        if(useRes != null){
          let formData = new FormData();
          formData.append('action', 'getAllMemories');
          formData.append('senderId', useRes['id']);
          this.symService.easyService(formData, useRes['token']).subscribe(data=>{
            const memories = data['response'];

            callback(memories);
              // this.insertBulkMemories(memories)
              // if(res[])
          }, err=>{
              // cl(err)
              if(err==='failed_to_authenticate'){
                  this.authentication.logout();
                  this.ionUtils.loadingDismiss();
              }
          });
        }
      } catch (error) {
        cl('MemoriesFromServer Error', error);
      }
  })
  }

  async insertMemories(memories) {
    // cl('bulk from server',memories)
    memories.isDeleted = 0;
    const productQueries: string[] = memories.map((memory: IMemory) => `INSERT INTO ${this.tableName} (id, memoryName, memoryBody, memoryType, videoMemoryPath, voiceMemoryPath, imageMemoryPath, reminder, repeatDelivery, deliveryDate, senderId, recipientId, receiverName, receiverSurname, receiverEmail, receiverContactNumber, location, viewStatus, sendStatus, dateCreated, isDeleted, syncStatus) values(${memory.id}, "${memory.memoryName}", "${memory.memoryBody}", "${memory.memoryType}", "${memory.videoMemoryPath}", "${memory.voiceMemoryPath}", "${memory.imageMemoryPath}", "${memory.reminder}", "${memory.repeatDelivery}", "${memory.deliveryDate}", ${memory.senderId}, ${memory.recipientId}, "${memory.receiverName}", "${memory.receiverSurname}", "${memory.receiverEmail}", "${memory.receiverContactNumber}", "${memory.location}", ${memory.viewStatus}, ${memory.sendStatus}, "${memory.dateCreated}", "${memory.isDeleted}", 1)`);
    // cl('bulk insertQueries',productQueries)
    try {
      await this.database.sqlBatch(productQueries);
      // this.setLastUpdatedDate();
    } catch (error) {
      cl(error);
      // this.presentToast(`product insert failed: ${error}`);
    }
  }

  async insertMemory(memory: IMemory) {
    // cl('memory data', memory)

    let productQuery: string;
    let MemorySync: boolean = false;
    memory.viewStatus = 0;
    memory.dateCreated = momentString()
    memory.isDeleted = 0
    memory.recipientId = null
    //alert(memory.videoMemoryPath);
    let localMemoryId = memory.memoryid;
   // alert(localMemoryId);
     cl('memory data', memory)
    this.networkStatus =  Network.getStatus().then((res: any)=>{
      // res.connected ? memory.syncStatus = true: memory.syncStatus = true;
      let connectStatus = res.connected;
      if(connectStatus){
        memory.syncStatus = true
         cl('memory data two', memory)
        this.appControl.createMemory(memory).then((res2) => {
          if(typeof res2 === 'object' && res2 !== null){
            memory = res2;
            MemorySync = true
          }

          this.getOneMemoryFromLocal(localMemoryId, data=>{
            // cl('serverResponse', [res2,memory,localMemoryId])
            if(data.status){
              memory.memoryid = localMemoryId;
              productQuery = this.prepareUpdateQuery(memory, MemorySync);
            }else{
              //alert('For local ' + memory.id);
              productQuery = this.prepareInsertQuery(memory, MemorySync);
            }
            this.insertOrUpdateMemoryToLocalDb(productQuery);
          })

        }).catch(err => {
          memory.syncStatus = false;
          MemorySync = false
          productQuery = this.prepareInsertQuery(memory, MemorySync);
          this.insertOrUpdateMemoryToLocalDb(productQuery);
        });
      }else{
        productQuery = this.prepareInsertQuery(memory, MemorySync);
        this.insertOrUpdateMemoryToLocalDb(productQuery);
      }
      });
  }

  getOneMemoryFromLocal(memoryid, callback) {
    let result = {status: false, memoryObj: {}};
    this.checkConnection((db)=>{
      let localDbData: any = [];
      db.executeSql(`select * from ${this.tableName} where memoryid = ${memoryid}`,[])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          // do something with it
          localDbData.push(item);
        }

        if(localDbData.length != 0){
          result.status = true;
          result.memoryObj = localDbData[0];
        }
        callback(result);

      })
      .catch(e => {
        console.log(e);
        callback(result)
      })
    })
  }

  async updateMemoryServer(memory: IMemory) {

    let productQuery: string;
    let MemorySync: boolean = false;
    memory.viewStatus = 0;
    memory.isDeleted = 0
    memory.recipientId = null
    // cl('memory data', memory)
    this.networkStatus =  await Network.getStatus().then((res: any)=>{
      // res.connected ? memory.syncStatus = true: memory.syncStatus = true;
      if(res.connected){
        memory.syncStatus = true
        this.appControl.createMemory(memory).then((res) => {
          // cl2('serverResponse', res)
          if(typeof res === 'object' && res !== null){
            memory = res;
            MemorySync = true
          }
          productQuery = this.prepareUpdateQuery(memory, MemorySync);
          cl('seeQuery', productQuery)
          this.insertOrUpdateMemoryToLocalDb(productQuery);
        }).catch(err => {
          memory.id = 0;
          productQuery = this.prepareUpdateQuery(memory, MemorySync);
          this.insertOrUpdateMemoryToLocalDb(productQuery);
          // console.log(err)
        });
      }
      });
  }

  prepareUpdateQuery(memory: IMemory, syncStatus: boolean): string {
    memory.isDeleted = 0;
    let updateQuery = `update ${this.tableName} set id = ${memory.id}, memoryName = "${memory.memoryName}", memoryBody = "${memory.memoryBody}", memoryType = "${memory.memoryType}", videoMemoryPath = "${memory.videoMemoryPath}", voiceMemoryPath = "${memory.voiceMemoryPath}", imageMemoryPath = "${memory.imageMemoryPath}", reminder = "${memory.reminder}", repeatDelivery = "${memory.repeatDelivery}", deliveryDate = "${memory.deliveryDate}", senderId = ${memory.senderId}, recipientId = ${memory.recipientId}, receiverName = "${memory.receiverName}", receiverSurname = "${memory.receiverSurname}", receiverEmail = "${memory.receiverEmail}", receiverContactNumber = "${memory.receiverContactNumber}",location = "${memory.location}" , viewStatus = ${memory.viewStatus}, sendStatus = ${memory.sendStatus}, dateCreated = "${memory.dateCreated}", isDeleted = ${memory.isDeleted}, syncStatus = ${memory.syncStatus} where memoryid = ${memory.memoryid}`;
    return updateQuery;
  }

  prepareBulkUpdateQuery(memories: IMemory[], syncStatus: boolean): string[] {
    const updateQueries: string[] = memories.map((memory: IMemory) =>  `update ${this.tableName} set id = ${memory.id}, memoryName = "${memory.memoryName}", memoryBody = "${memory.memoryBody}", memoryType = "${memory.memoryType}", videoMemoryPath = "${memory.videoMemoryPath}", voiceMemoryPath = "${memory.voiceMemoryPath}", imageMemoryPath = "${memory.imageMemoryPath}", reminder = "${memory.reminder}", repeatDelivery = "${memory.repeatDelivery}", deliveryDate = "${memory.deliveryDate}", senderId = ${memory.senderId}, recipientId = ${memory.recipientId}, receiverName = "${memory.receiverName}", receiverSurname = "${memory.receiverSurname}", receiverEmail = "${memory.receiverEmail}", receiverContactNumber = "${memory.receiverContactNumber}", location = "${memory.location}", viewStatus = ${memory.viewStatus}, sendStatus = ${memory.sendStatus}, dateCreated = "${memory.dateCreated}", isDeleted = 0, syncStatus = ${syncStatus} where id = ${memory.id}`);
    return updateQueries;
  }



  async insertOrUpdateMemoryToLocalDb(productQuery){
    cl('seeQuery', productQuery)
    try {
      await this.database.executeSql(productQuery, []).then(data=>{
        cl(data);
      });
    } catch (error) {
      cl(error);
    }
  }

  prepareInsertQuery(memory, syncStatus){
    memory.isDeleted = 0;
    let dbFieldNames = this.dbFieldNamesArray.join(", ");
    // cl('memoryCheck', memory)
    let insertQuery = `insert into ${this.tableName} (${dbFieldNames}) values(${memory.id}, "${memory.memoryName}", "${memory.memoryBody}", "${memory.memoryType}", "${memory.videoMemoryPath}", "${memory.voiceMemoryPath}", "${memory.imageMemoryPath}", "${memory.reminder}", "${memory.repeatDelivery}", "${memory.deliveryDate}", ${memory.senderId}, ${memory.recipientId}, "${memory.receiverName}", "${memory.receiverSurname}", "${memory.receiverEmail}", "${memory.receiverContactNumber}", "${memory.location}", ${memory.viewStatus}, ${memory.sendStatus}, "${memory.dateCreated}", ${memory.isDeleted}, ${syncStatus})`;
    // cl('insert query', insertQuery)
    return insertQuery;
  }

 async updateMemory(memory: IMemory) {
   let results:any = []
    // let dataSet = [memory.memoryid ,memory.id, memory.memoryName, memory.memoryBody, memory.memoryType, memory.videoMemoryPath, memory.voiceMemoryPath, memory.imageMemoryPath, memory.reminder, memory.repeatDelivery, memory.deliveryDate, memory.senderId, memory.recipientId, memory.viewStatus, memory.sendStatus, memory.dateCreated, memory.isDeleted, memory.syncStatus]
    let sqlQuery = `update ${this.tableName} set id = ${memory.id}, memoryName = "${memory.memoryName}", memoryBody = "${memory.memoryBody}", memoryType = "${memory.memoryType}", videoMemoryPath = "${memory.videoMemoryPath}", voiceMemoryPath = "${memory.voiceMemoryPath}", imageMemoryPath = "${memory.imageMemoryPath}", reminder = "${memory.reminder}", repeatDelivery = "${memory.repeatDelivery}", deliveryDate = "${memory.deliveryDate}", senderId = ${memory.senderId}, recipientId = ${memory.recipientId}, receiverName = ${memory.receiverName}, receiverSurname = ${memory.receiverSurname}, receiverEmail = ${memory.receiverEmail}, receiverContactNumber = ${memory.receiverContactNumber}, location = "${memory.location}", viewStatus = ${memory.viewStatus}, sendStatus = ${memory.sendStatus}, dateCreated = "${memory.dateCreated}", isDeleted = ${memory.isDeleted}, syncStatus = ${memory.syncStatus} where id = ${memory.id}`;
    // cl(sqlQuery)
    try {
      await this.database.executeSql(sqlQuery).then(data=>{
        // cl(data)
      });
      // this.setLastUpdatedDate();
    } catch (error) {
      // cl(error);
      // this.presentToast(`product insert failed: ${error}`);
    }
  }

  async deleteAllFromDb(){



    cl(testEmogi, 'test test')
    try {
      await this.database.executeSql(`delete from ${this.tableName}`, []);
      console.log("all deleted");
      return true;
    } catch(error) {
      // console.error("error occurred " + error.message);
      return false;
      }
  }

  async deleteMemoryById(memory){
    if(memory.id == null){
        this.deleteMemoryLocalDbByMemoryId(memory.id).then(res=>{
          return res
      })
    } else{
      this.deleteMemoryFromServer(memory.id, res=>{
        if(res){
          this.deleteMemoryLocalDb(memory.id).then(res=>{
            return res
          })
        }else {
          this.updateMemoryAsDeleted(memory.id).then(res=>{
            return res;
          })
        }
      });
    }
  }

  async updateMemoryAsDeleted(id: any) {
    let isDeleted = 1;
    let syncStatus = 0;
    let sqlQuery = `update ${this.tableName} set isDeleted = ${isDeleted}, syncStatus = ${syncStatus} where id = ${id}`;
    try {
      await this.database.executeSql(sqlQuery, []);
      return true;
    } catch(error) {
      return false;
    }
  }

  async deleteMemoryLocalDb(id){
    try {
      await this.database.executeSql(`delete from ${this.tableName} where id = ${id}`, []);
      // console.log("all deleted");
      return true;
    } catch(error) {
      // console.error("error occurred " + error.message);
      return false;
      }
  }


  async deleteMemoryLocalDbByMemoryId(memoryId){
    try {
      await this.database.executeSql(`delete from ${this.tableName} where memoryId = ${memoryId}`, []);
      // console.log("all deleted");
      return true;
    } catch(error) {
      // console.error("error occurred " + error.message);
      return false;
      }
  }


  private async deleteMemoryFromServer(id, callback){
    this.networkStatus =  await Network.getStatus().then((res: any)=>{
      // res.connected ? memory.syncStatus = true: memory.syncStatus = true;
      if(res.connected){
        this.appControl.deleteMemory({id: id}).then((res) => {
          // cl2('serverResponse', res)
          callback(res);
        }).catch(err => {
          callback(false);
        });
      }else{
        callback(false);
      }
      });
  }

  getMemories(callback){
   // alert(1);
    this.checkConnection((db)=>{
      let results: any = [];
      
      db.executeSql(`select * from ${this.tableName}`,[])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          // do something with it

          results.push(item);
        }

        callback(results);

      })
      .catch(e => {
        console.log(e);
      })

    })
  }

  getUnsyncedMemories(callback){
    this.checkConnection(db=>{
      let results: any = [];
      db.executeSql(`select * from ${this.tableName} where syncStatus = 0`,[])
      .then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          let item = data.rows.item(i);
          // do something with it

          results.push(item);
        }
        callback(results);

      })
      .catch(e => {
        console.log(e);
      })

    })
  }

  getMemoryById(id, callback){
    let results: any = [];
    this.database.executeSql(`select * from ${this.tableName} where id = ${id}`,[])
    .then((data) => {
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        results.push(item);
      }
      callback(results[0]);

    })
    .catch(e => {
      console.log(e);
    })
  }

  // getLatestMemoryId() {
  //   throw new Error('Method not implemented.');
  // }
  getLatestMemoryId(callback){
    this.getLatestMemory(memory=>{
      // memory['id'] = 500;
      this.appControl.getLatestMemories(memory).then(res=>{
        this.insertMemories(res).then(()=>{
          this.getMemories(localMemory=>{
            callback(localMemory)
          })
        })
      })
    })
  }


  getLatestMemory(callback){
    let results: any = [];
    this.database.executeSql(`select * from ${this.tableName} where id = (select MAX(id) from ${this.tableName})`,[])
    .then((data) => {
      for (let i = 0; i < data.rows.length; i++) {
        let item = data.rows.item(i);
        results.push(item);
      }
      callback(results[0]);
    })
    .catch(e => {
      console.log(e);
    })
  }



  createDb(){
    this.plt.ready().then(()=>{
      this.sqlite.create(this.dbOptions).then((db: SQLiteObject)=>{
        this.database = db;
       // alert('database created');
        db.executeSql(this.databaseCreateTableQuery, [])
        .then(() => {
          this.onAppLogin();
        })
        .catch(e => console.log(e));
      })
    });
  }

  checkConnection(callback){
    this.plt.ready().then(()=>{
      this.sqlite.create(this.dbOptions).then((db: SQLiteObject)=>{
        callback(db);
      })
    });
  }

  dropTable(callback){
    this.plt.ready().then(()=>{
      this.sqlite.create(this.dbOptions).then((db: SQLiteObject)=>{
        this.database = db;
        let results: any = [];
        // cl('databaseDropTableQuery', this.databaseDropTableQuery)
        this.database.executeSql(this.databaseDropTableQuery,[])
        .then((data) => {
          // cl(`table-dropped: ${this.tableName}`, data)
          callback(true)
        })
        .catch(e => {
          callback(false)
        })
      })
    });
  }

  ngOnDestroy() {
    this.networkListener.remove();
  }
}
