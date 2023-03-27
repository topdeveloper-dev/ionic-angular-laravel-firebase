export var rootFileUrl : string = "https://lovedonez.bpslab.co.za/";
export var apiUrl : string = "https://lovedonez.bpslab.co.za/api.lovedOnez";
//export var rootFileUrl : string = "https://lovedOnez.etopick.com/";
//export var apiUrl : string = "https://lovedOnez.etopick.com/api.lovedOnez";
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import CryptoES from 'crypto-es';
import { Plugins } from '@capacitor/core';
const { Toast } = Plugins;
// npm install crypto-es

export interface IUserData {
    status: boolean;
    message: string;
    userData: [];
}
export interface IiconData {
    icon: string; 
    color: string;
  }
export interface ImessageStatData {
    id: number; 
    color: string;
  }

  export interface Imessage {
    "memoryType": String;
    "messageName": String;
    "messageBody": String;
  }
  
export function cl(x,y?){
  if(y===undefined){
    console.log(x);
  }else{
    console.log(x, y);
  }
}
export function cl2(x,y){
    console.log(x,y);
}

export function jsonToString(x){
  return JSON.stringify(x);
}

export function stringToJson(x){
  return JSON.parse(x);
}
export function trimString(x){
  return x.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

export function isNull(val)
{
    return ((val == undefined)||(val === null)||(val === 'null'));
}

export function isUndefinedString(val)
{
    return ((val == undefined)||(trimString(val) === '')||((val == 'undefined')));
}

export function isUndefinedToString(val)
{
    return val === undefined ? '' : val;
}

export function isString(varb)
{
    let res: boolean;
    if (typeof varb == 'string' || varb instanceof String)
    {
      res = true;
    }
    else
    {
      res = false;
    }
    return res;
}
export function momentString()
{
    return moment().format();
}
export function momentStringForm()
{
    return moment().format('YYYY-MM-DTH:mm').toString()+'Z';
    // 2020-12-10T11:06Z
}

export function momentParseDateString(x)
{
    return moment(x).format('lll');
    // 2020-12-10T11:06Z
}

export function momentComparison(x)
{
  let A = moment();
  let B = moment(x);

    return A.diff(B, 'days');
    // 2020-12-10T11:06Z
}

export function isAfterDateTime(date)
{
  let currentDateTime = moment();
  return moment(date).isAfter(currentDateTime);
}

export function randomString()
{
    return CryptoES.MD5(moment().format()).toString();
}

export function secondsToHHMMSS(secs) {
  var sec_num = parseInt(secs, 10)
  var minutes = Math.floor(sec_num / 60) % 60
  var seconds = sec_num % 60

  return [minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v, i) => v !== "00" || i >= 0)
    .join(":")
}

export async function showToast(x) {
  await Toast.show({
    text: x
  });
}

// export getMimetype(name){
//   let splitted = name.split("."); 
//   let lastElementInArray = splitted[splitted.length-1]
//  return getMimeType(lastElementInArray);
// }






export var kingEmogi = '\u{1F934}\u{1F3FF}';
export var testEmogi = '\u{1F9EA}';

export interface IMemory {
  memoryid?: number, 
  id?: number, 
  memoryName?: string, 
  memoryBody?: string, 
  memoryType?: string, 
  videoMemoryPath?: string, 
  voiceMemoryPath?: string, 
  imageMemoryPath?: string, 
  reminder?: string, 
  repeatDelivery?: string, 
  deliveryDate?: string, 
  senderId?: number, 
  recipientId?: number, 
  receiverName?: string,
  receiverSurname?: string,
  receiverEmail?: string,
  receiverContactNumber?: string,
  location?: string,
  viewStatus?: number, 
  sendStatus?: number, 
  dateCreated?: string, 
  isDeleted?: number, 
  syncStatus?: boolean
};