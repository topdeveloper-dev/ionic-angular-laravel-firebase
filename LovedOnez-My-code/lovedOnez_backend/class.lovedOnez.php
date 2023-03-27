<?php 
class lovedOnez extends PDO{
    public function __construct($config)
    {
        parent::__construct($config['db_type'].':host='.$config['db_host'].';dbname='.$config['db_name'],$config['db_username'],$config['db_password']);
        $this->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // always disable emulated prepared statement when using the MySQL driver
        $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $this->cors();
        $this->currentDateTime = date("Y-m-d H:i:s");
        $this->dateObj = new Datetime();
        $this->apiAccessKey = $config['apiAccessKey'];
    }

    public function cors() {

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: *");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }
    
        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
    
            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
            exit(0);
        }
    
        // echo "You have CORS!";
    }

    public function expLogin($values)
	{
        $stmt = parent::prepare("SELECT * FROM loved_Users WHERE userEmail = :userEmail AND symId = :symId");
        $stmt->bindValue(':userEmail', $values['userEmail']);
        $stmt->bindValue(':symId', $values['symId']);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        
        $stmt2 = parent::prepare("SELECT id, activationStatus FROM loved_Users WHERE id = :id");
        $stmt2->bindValue(':id', $result[0]['id']);
        $stmt2->execute();
        $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        
        $salt = md5($result[0]['dateCreated']);
        $passhash = hash('sha256', $salt.$values['userPassword'].$salt);
        
        // echo '<pre>';
        // print_r($result[0]['userPassword'].'__'.$passhash);
        // echo '</pre>';
        // exit;
        // $boolAct = trim($result[0]['activationStatus'])==1 ? 'true' : 'false';
        // print_r ($passhash.'_____'. $result[0]['userPassword']);
        
        
        // if($boolAct == 'false' ){
        //     return 'notActivated';

        // }else{
                if($passhash == $result[0]['userPassword']){

                    $deviceInfo = array(
                        'userId'=> $result2[0]['id'],
                        'deviceToken'=> $values['deviceToken'],
                    );
                    
                    $addDevice = $this->addDeviceToken($deviceInfo);

                    if($addDevice){
                        $userData = $this->getUserByEmail($values);
                        // $userData['deviceToken'] = $values['deviceToken'];
                        return $userData;
                    }

                }
                else{
                    return 0;
                }
        // }
    }

    public function ResetPassword($userid, $password, $code)
	{
		try {
			$query = parent::prepare("select * from loved_passwordrecovery where userid=:userid and code=:code and status=1 order by id desc limit 1");
			$query->bindParam("userid", $userid);
			$query->bindParam("code", $code);
			$query->execute();
			if ($query->rowCount() > 0) {
				$query = parent::prepare("update loved_Users set userPassword=:userPassword where id=:id");
				$encrypted = md5($password);
				$query->bindParam("userPassword", $encrypted);
				$query->bindParam("id", $userid);
				if ($query->execute()) {
					$query = parent::prepare("update loved_passwordrecovery set status=0 where id=:id");
					$query->bindParam("id", $userid);
					return $query->execute();
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		} catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }
    
    public function ChangePassword($userid, $password, $oldpassword)
	{
		try {
			$query = parent::prepare("update loved_Users set userPassword=:userPassword where id=:id and userPassword=:oldpassword");
			$encrypted = md5($password);
			$old = md5($oldpassword);
			//echo $old;

			$query->bindParam("password", $encrypted);
			$query->bindParam("oldpassword", $old);
			$query->bindParam("id", $userid);
			$query->execute();
			$result = $query->rowCount();

			if ($result)
				echo "Success : Password Changed!!!";
			else
				echo "Error : New password shold not same as old password!";
		} catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
	}

    public function isEmail($email){
        $userEmail = trim(strtolower($email));
		try {
			$query = parent::prepare("SELECT * FROM loved_Users WHERE userEmail=:userEmail");
			$query->bindParam("userEmail", $userEmail, PDO::PARAM_STR);
			$query->execute();
			if ($query->rowCount() > 0) {
				return true;
			} else {
				return false;
			}
		} catch (PDOException $e) {
			exit($e->getMessage());
		}
    }
    public function isValidEmail($email) {
        if(is_array($email) || is_numeric($email) || is_bool($email) || is_float($email) || is_file($email) || is_dir($email) || is_int($email))
            return false;
        else
        {
            $email=trim(strtolower($email));
            if(filter_var($email, FILTER_VALIDATE_EMAIL)!==false) return $email;
            else
            {
                $pattern = '/^(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-+[a-z0-9]+)*)|(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))$/iD';
                return (preg_match($pattern, $email) === 1) ? $email : false;
            }
        }
    }
    
    public function sendEmail($settings)
	{

		// $email = "noreply@lovedonez.bpslab.co.za";
		$headers = 'From: ' . $settings['from'] . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		$message = '<html>';
		$message .= '<body>' . "\r\n";
		$message .= $settings['body'] . "\r\n";
		$message .= '<br />Message sent on Date: ' . date("Y-m-d") . "    " . date("h:i:sa") . "\r\n";
		$message .= '</body></html>';
		mail($settings['to'], $settings['subject'], $message, $headers);
    }
    

    public function NewUser($email, $id)
	{
		try {
			$code = bin2hex(openssl_random_pseudo_bytes(32));
			$query = parent::prepare("insert into loved_passwordrecovery(UserId,Email,Code)values(:userid,:email,:code)");
			$query->bindParam("email", $email);
			$query->bindParam("userid", $id);
			$query->bindParam("code", $code);
            $temp = $query->execute();
            $lastId =parent::lastInsertId();;
            $this->addSettings($lastId);

			if ($lastId > 0) {
                $stmt = parent::prepare("SELECT * FROM loved_passwordrecovery WHERE id = :id");
                $stmt->bindParam("id", $lastId);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

				$subject = "Loved 1z User Account: Activate Account";
				$url = "https://lovedonez.bpslab.co.za/ActivateAccount?id=" . $lastId . "&code=" . $result[0]['Code'];
				$message = "Dear User, \nPlease follow the below link to activate your loved1nz account \n" . "<a href ='$url'>Activate Account<a>";
				$to = $email;
				$from = "noreply@lovedonez.bpslab.co.za";
				$headers  = "From:$from\n";
				$headers .= "MIME-Version: 1.0\r\n";
				$headers .= "Content-type: text/html;charset=utf-8\r\n";

				return mail($to, $subject, $message, $headers);
			} else {
				return 2;
			}
		} catch (PDOException $e) {
			exit($e->getMessage());
			$e->getMessage();
			echo $e->getMessage();
			return 0;
		}
    }

    public function recoverEmail($email){
        $userEmail = trim(strtolower($email));

		try {
            if($this->isEmail($userEmail)){
                
                $stmt = parent::prepare("SELECT id, firstName, userEmail FROM loved_Users WHERE userEmail = :userEmail");
                $stmt->bindValue(':userEmail', $userEmail);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $code = bin2hex(openssl_random_pseudo_bytes(32));
                $query = parent::prepare("INSERT INTO loved_passwordrecovery(UserId, Email, Code) VALUES(:UserId ,:Email, :Code)");
                $query->bindParam("UserId", $result[0]['id']);
                $query->bindParam("Email", $result[0]['userEmail']);
                $query->bindParam("Code", $code);
                $temp = $query->execute();
                $lastId = parent::lastInsertId();
                if ($lastId > 0) {
                    $stmt2 = parent::prepare("SELECT * FROM loved_passwordrecovery WHERE id = :id");
                    $stmt2->bindParam("id", $lastId);
                    $stmt2->execute();
                    $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    
                    $recoverPasswordStatus = 2;
                    $newId = parent::prepare("UPDATE loved_Users SET activationStatus = :activationStatus WHERE id = :id");
                    $newId->bindParam(':activationStatus', $recoverPasswordStatus);
                    $newId->bindParam(':id', $result[0]['id']);
                    $newId->execute();
    
                    $subject = "Loved 1z User Account: Recover Password.";
                    $url = "https://lovedonez.bpslab.co.za/ChangePassword?id=" . $lastId . "&code=" . $result2[0]['Code'];
                    $message = "Dear ".$result[0]['firstName'].", \nAdmin would link to confirm if you requested Password Recovery.\n To login follow the link below to create a new password. \n" . "<a href ='$url'>Change Password<a>";
                    $to = $result[0]['userEmail'];
                    $from = "noreply@lovedonez.bpslab.co.za";
                    $headers  = "From:$from\n";
                    $headers .= "MIME-Version: 1.0\r\n";
                    $headers .= "Content-type: text/html;charset=utf-8\r\n";
                    return mail($to, $subject, $message, $headers);
                    
                } else {
                    return 2;
                }
            } else {
                return 'emailNoExist';
            }
		} catch (PDOException $e) {
			exit($e->getMessage());
			$e->getMessage();
			echo $e->getMessage();
			return 0;
		}
    }
    
    public function activateUser($values){

        $values['activationStatus'] = 1;
        $stmt = parent::prepare("SELECT * FROM loved_passwordrecovery WHERE id = :id AND code = :code");
        $stmt->bindValue(':id', $values['id']);
        $stmt->bindValue(':code', $values['code']);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $length = count($result);

        if($length > 0){

            $userEmail = $result[0]['Email'];
            $newId = parent::prepare("UPDATE loved_Users SET activationStatus = :activationStatus WHERE userEmail = :userEmail");
            $newId->bindValue(':activationStatus', $values['activationStatus']);
            $newId->bindValue(':userEmail', $userEmail);
            $newId->execute();
    
            // $stmt2 = parent::prepare("DELETE FROM loved_passwordrecovery WHERE :email=email");
            // $stmt2->bindParam(':email', $email, PDO::PARAM_STR);
            // $stmt2->execute();
            
            $stmt = parent::prepare("SELECT firstName, lastName FROM loved_Users WHERE userEmail = :userEmail");
            $stmt->bindValue(':userEmail', $userEmail);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
        }else{
            return 0;
        }
        


    }

    public function changePasswordRecovery($values){

        $stmt = parent::prepare("SELECT * FROM loved_passwordrecovery WHERE id = :id AND code = :code");
        $stmt->bindValue(':id', $values['id']);
        $stmt->bindValue(':code', $values['code']);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $length = count($result);

        if($length > 0){

            $userEmail = $result[0]['Email'];
            $salt = md5($this->currentDateTime);
            $passhash = hash('sha256', $salt.$values['password'].$salt);
            
            $newId = parent::prepare("UPDATE loved_Users SET userPassword = :userPassword, activationStatus = :activationStatus, dateCreated=:dateCreated WHERE userEmail = :userEmail");
            $newId->bindValue(':userPassword', $passhash);
            $newId->bindValue(':activationStatus', 1);
            $newId->bindValue(':userEmail', $userEmail);
            $newId->bindValue(':dateCreated', $this->currentDateTime);
            $newId->execute();

            // $stmt2 = parent::prepare("DELETE FROM loved_passwordrecovery WHERE :email=email");
            // $stmt2->bindParam(':email', $email, PDO::PARAM_STR);
            // $stmt2->execute();
            
            $stmt = parent::prepare("SELECT firstName, lastName FROM loved_Users WHERE userEmail = :userEmail");
            $stmt->bindValue(':userEmail', $userEmail);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return $result;
        }else{
            return 0;
        }
    }



// ---------------- || ADD FUNCTIONS || ------------------------------

	public function addMemory($values)
	{

        $checkReceiver = $this->getReceiverInfo($values);
        if(!empty($checkReceiver)){
            $receiverId = $checkReceiver[0]['id'];
        }else{   
            $receiverId =  $this->addReceiverDetails($values);
        }
        // echo '<pre>';
        //        print_r($receiverId);
        //        echo '</pre>';
        //        exit;
        $newId = parent::prepare("INSERT INTO loved_memory (memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath ,imageMemoryPath ,reminder ,repeatDelivery ,deliveryDate ,senderId ,recipientId, location ,sendStatus ,dateCreated  ) VALUES (:memoryName ,:memoryBody ,:memoryType ,:videoMemoryPath ,:voiceMemoryPath ,:imageMemoryPath ,:reminder ,:repeatDelivery ,:deliveryDate ,:senderId ,:recipientId, :location ,:sendStatus ,:dateCreated )");
        $newId->bindValue(':memoryName', $values['memoryName']);
        $newId->bindValue(':memoryBody', $values['memoryBody']);
        $newId->bindValue(':memoryType', $values['memoryType']);
        $newId->bindValue(':videoMemoryPath', $values['videoMemoryPath']);
        $newId->bindValue(':voiceMemoryPath', $values['voiceMemoryPath']);
        $newId->bindValue(':imageMemoryPath', $values['imageMemoryPath']);
        $newId->bindValue(':reminder', $values['reminder']);
        $newId->bindValue(':repeatDelivery', $values['repeatDelivery']);
        $newId->bindValue(':deliveryDate', $values['deliveryDate']);
        $newId->bindValue(':senderId', $values['senderId']);
        $newId->bindValue(':recipientId', $receiverId);
        $newId->bindValue(':location', $values['location']);
        // $newId->bindValue(':viewStatus', $values['viewStatus']);
        $newId->bindValue(':sendStatus', $values['sendStatus']);
        $newId->bindValue(':dateCreated', $this->currentDateTime);
        $newId->execute();
        $lastInsertedId = parent::lastInsertId();
        if($values['deliveryDate'] == 'now'){
            $res = $this->resolveMemorySend($values);
        }
        $data = array(
            'id'=> $lastInsertedId,
            'senderId'=> $values['senderId'],
            'recipientId'=> $receiverId
        );
        return $this->getOneMemoryById($data);
    }

	public function addSettings($userId)
	{
        $newId = parent::prepare("INSERT INTO loved_appSetting (userId ) VALUES (:userId )");
        $newId->bindValue(':userId', $userId);
		$inserted = $newId->execute();
		return $inserted;
    }

	private function addDeviceToken($values)
	{
        $deviceByToken = $this->getDeviceByToken($values);
        if (empty($deviceByToken)) {
            $newId = parent::prepare("INSERT INTO loved_device (deviceToken, userId) VALUES (:deviceToken, :userId)");
            $newId->bindValue(':userId', $values['userId']);
            $newId->bindValue(':deviceToken', $values['deviceToken']);
            $result = $newId->execute();
        } else{
            $result = $this->updateDeviceUserByToken($values);
        }
        return $result;

    }

	private function addReceiverDetails($values)
	{  
            $values['userType'] = 4;
            $values['symId'] = 1;
            $values['activationStatus'] = 0;
            $values['userPassword'] = 'not_applicable';
            
            $newId = parent::prepare("INSERT INTO loved_Users (firstName, lastName, userEmail, mobileNumber, userPassword, userType, symId, activationStatus, dateCreated ) VALUES (:firstName, :lastName, :userEmail, :mobileNumber, :userPassword, :userType, :symId, :activationStatus, :dateCreated )");
            $newId->bindValue(':firstName', $values['receiverName']);
            $newId->bindValue(':lastName', $values['receiverSurname']);
            $newId->bindValue(':userEmail', $values['receiverEmail']);
            $newId->bindValue(':mobileNumber', $values['receiverContactNumber']);
            $newId->bindValue(':userPassword', $values['userPassword']);
            $newId->bindValue(':userType', $values['userType']);
            $newId->bindValue(':symId', $values['symId']);
            $newId->bindValue(':activationStatus', $values['activationStatus']);
            $newId->bindValue(':dateCreated', $this->currentDateTime);
            $newId->execute();
            $lastInsertedId = parent::lastInsertId();
            return $lastInsertedId;
    }

	public function addExpense($values)
	{
		$newId = parent::prepare("INSERT INTO loved_Users (expName, expType, expCost, expDate, symUser, symId ) VALUES (:expName, :expType, :expCost, :expDate, :symUser, :symId )");
		$newId->bindValue(':expName', $values['expName']);
		$newId->bindValue(':expType', $values['expType']);
		$newId->bindValue(':expCost', $values['expCost']);
		$newId->bindValue(':expDate', $values['expDate']);
		$newId->bindValue(':symUser', $values['symUser']);
        $newId->bindValue(':symId', $values['symId']);

		$inserted = $newId->execute();

		return $newId;
    }
    
    public function addUser($values){
        $userEmail = trim(strtolower($values['userEmail']));
        if(!$this->isEmail($userEmail)){

            $salt = md5($this->currentDateTime);
            $passhash = hash('sha256', $salt.$values['userPassword'].$salt);
            
            $newId = parent::prepare("INSERT INTO loved_Users (firstName, lastName, userEmail, mobileNumber, userPassword, userType, symId, activationStatus, dateCreated ) VALUES (:firstName, :lastName, :userEmail, :mobileNumber, :userPassword, :userType, :symId, :activationStatus, :dateCreated )");
            $newId->bindValue(':firstName', $values['firstName']);
            $newId->bindValue(':lastName', $values['lastName']);
            $newId->bindValue(':userEmail', $userEmail);
            $newId->bindValue(':mobileNumber', $values['mobileNumber']);
            $newId->bindValue(':userPassword', $passhash);
            $newId->bindValue(':userType', $values['userType']);
            $newId->bindValue(':symId', $values['symId']);
            $newId->bindValue(':activationStatus', $values['activationStatus']);
            $newId->bindValue(':dateCreated', $this->currentDateTime);
            
            $inserteId = $newId->execute();
            
            if($inserteId){
                $this->NewUser($values['userEmail'], $inserteId);
            }
            
        }else{
            return 'email_exist';
        }
    }

    public function addPayment($values)
    {
        $newId = parent::prepare("INSERT INTO loved_Users (expName, expType, expCost, expDate, symUser, symId ) VALUES (:expName, :expType, :expCost, :expDate, :symUser, :symId )");
        $newId->bindValue(':expName', $values['expName']);
        $newId->bindValue(':expType', $values['expType']);
        $newId->bindValue(':expCost', $values['expCost']);
        $newId->bindValue(':expDate', $values['expDate']);
        $newId->bindValue(':symUser', $values['symUser']);
        $newId->bindValue(':symId', $values['symId']);

        $inserted = $newId->execute();

        return $newId;
    }

    //--------------------------

    public function addCardDetails($values){

        //require './constants.php';

        $r = array();

        if( isset($values['userId'], $values['cardNumber'],$values['cvv'],$values['holder'],$values['month'], $values['year'], $values['brand']) ){
            $userId = $values['userId'];
            $number = $values['cardNumber'];
            $cvv = $values['cvv'];
            $holder = $values['holder'];
            $month = $values['month'];
            $brand = $values['brand'];
            $year = $values['year'];

            $url = "https://test.oppwa.com/v1/registrations";
            $data = "entityId=8ac7a4c87d946487017d94bdc685007f" .
                        "&paymentBrand=" . $brand .
                        "&card.number=" . $number .
                        "&card.holder=" . $holder .
                        "&card.expiryMonth=" . $month .
                        "&card.expiryYear=" . $year .
                        "&card.cvv=" . $cvv;

        $r['stage'] = 'CURL to Peach Payments';
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                        'Authorization: Bearer OGFjN2E0Yzc3ZDk0NjE4MzAxN2Q5NGJkYmIyZDAxYmZ8aE01M3BIWEZqSA=='));
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);// this should be set to true in production
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $responseData = curl_exec($ch);
            $responseData = json_decode($responseData,true);
            $r['responseData'] = $responseData;
            if(curl_errno($ch)) {
                $r['error'] = curl_error($ch);
            }else{
            $r['responseData'] = $responseData;
                $tokenizationID = $responseData['id'];
                $result = $responseData['result']['code'];
                $bin = $responseData['card']['bin'];
                $last4 = $responseData['card']['last4Digits'];
                //$userId = $responseData['userId']['userId'];
                
                /*$connect = mysqli_connect(hostname,user,password,database);
                
                $sql = "INSERT INTO payment_card(tokenizationID,BIN,Last4digits,Holder,expiryMonth,expiryYear,uid,brand) 
                VALUES('$tokenizationID','$bin','$last4','$holder',$month,$year,'$username','$brand');";

                if($q = mysqli_multi_query($connect,$sql)){
                    $r['success'] = true;
                }else{
                    $r['error'] = "SQL Error ::: " . mysqli_error($connect);
                }
                mysqli_close($connect);
        */
        $newId = parent::prepare("INSERT INTO loved_Payment_Card_Test (tokenizationID, bin, last4digits, cardHolder, expiryMonth, expiryYear, brand, userId) VALUES (:tokenizationID, :bin, :last4digits, :cardHolder, :expiryMonth, :expiryYear, :brand, :userId)");
        $newId->bindValue(':tokenizationID', $tokenizationID);
        $newId->bindValue(':bin',  $bin);
        $newId->bindValue(':last4digits', $last4);
        $newId->bindValue(':cardHolder', $holder);
        $newId->bindValue(':expiryMonth', $month);
        $newId->bindValue(':expiryYear', $year);
        $newId->bindValue(':brand', $brand);
        $newId->bindValue(':userId', $userId);
        
       
        $inserted = $newId->execute();
        return $inserted;
    
        }
        curl_close($ch);

    }else{
        $r['error'] = "Missing Params";
        $r['result'] = false;
    }

    return $r;
    } 

    //--------------------------


    public function proccessdPayment($values){

        // return $values;

        //require './constants.php';
        $callback = array();

        $tokenizationID = $values['tokenizationID'];
        $amount = $values['amount'];
        $amount = floatval($amount);

        $url = "https://test.oppwa.com/v1/registrations/" . $tokenizationID . "/payments";
        $data = "" .
                    "entityId=8ac7a4c87d946487017d94bdc685007f" .
                    "&amount=" . $amount .
                    "&currency=ZAR" .
                    "&recurringType=REPEATED" .
                    "&shopperResultUrl=https://us-central1-ryde-d6360.cloudfunctions.net/getPaymentStatus" .
                    "&paymentType=DB";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Authorization: Bearer OGFjN2E0Yzc3ZDk0NjE4MzAxN2Q5NGJkYmIyZDAxYmZ8aE01M3BIWEZqSA=='));
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);// this should be set to true in production
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $responseData = curl_exec($ch);
        if(curl_errno($ch)) {
            $callback['error'] = curl_error($ch);
        }
        $responseData = json_decode($responseData,true);

        $resultCode = $responseData['result']['code'];
        $callback['api-results'] = $responseData;
        $callback['peach-results'] = $resultCode;
        $match = "(000\\.000\\.|000\\.100\\.1|000\\.[36])";

        if(preg_match($match, $resultCode) >= 1){
            //save the results in the database
            $callback['result'] = "success";
            $callback['result_extra'] = "Payment Succeeded";
        }
        else if(preg_match("(000\\.400\\.[1][0-9][1-9]|000\\.400\\.2)",$resultCode)){
            $callback['result'] = "failed";
            $callback['result_extra'] = "Failed to complete card transaction!";
        }else if(preg_match("(100\.55)",$resultCode)){
            $callback['result'] = "failed";
            $callback['result_extra'] = "Failed to complete card transaction!";
        }else if(preg_match("(100\.[13]50)",$resultCode)){
            $callback['result'] = "failed";
            $callback['result_extra'] = "Failed to complete card transaction!";
        }
        else{
            $callback['result'] = "failed";
            $callback['result_extra'] = "No Regular Expression match!";
        }

        curl_close($ch);
        //return $callback;

    }

    //--------------------------



    public function syncMemories($memoryData){
        $syncdMemories = array();
        foreach ($memoryData[0] as $key => $value) {
            if($value['isDeleted'] == 1){
                if($value['id'] == 0){
                    // 
                } else{
                    $this->deleteMemory($value);
                }
            }else{
                if($value['syncStatus'] == 0){
                    $newMemoryObj = $this->addMemory($value);
                    // echo '<pre>';
                    // print_r($newMemoryObj);
                    // echo '</pre>';
                    // exit;
                    $newMemory = Array(
                        // 'memoryid' => $value['memoryid'],
                        'id'=> $newMemoryObj[0]['id'],
                        'memoryName'=> $newMemoryObj[0]['memoryName'],
                        'memoryBody'=> $newMemoryObj[0]['memoryBody'],
                        'memoryType'=> $newMemoryObj[0]['memoryType'],
                        'videoMemoryPath'=> $value['videoMemoryPath'],
                        'voiceMemoryPath'=> $value['voiceMemoryPath'],
                        'imageMemoryPath'=> $value['imageMemoryPath'],
                        'reminder'=> $newMemoryObj[0]['reminder'],
                        'repeatDelivery'=> $newMemoryObj[0]['repeatDelivery'],
                        'deliveryDate'=> $newMemoryObj[0]['deliveryDate'],
                        'senderId'=> $newMemoryObj[0]['senderId'],
                        'recipientId'=> $newMemoryObj[0]['recipientId'],
                        'receiverName'=> $newMemoryObj[0]['receiverName'],
                        'receiverSurname'=> $newMemoryObj[0]['receiverSurname'],
                        'receiverEmail'=> $newMemoryObj[0]['receiverEmail'],
                        'receiverContactNumber'=> $newMemoryObj[0]['receiverContactNumber'],
                        'location'=> $newMemoryObj[0]['location'],
                        'viewStatus'=> $newMemoryObj[0]['viewStatus'],
                        'sendStatus'=> $newMemoryObj[0]['sendStatus'],
                        'dateCreated'=> $newMemoryObj[0]['dateCreated'],
                        'isDeleted'=> $newMemoryObj[0]['isDeleted'],
                        'syncStatus'=> 1
                    );
                    array_push($syncdMemories, $newMemory);
                }else{
                    array_push($syncdMemories, $value);
                }
            }
        }
        return $syncdMemories;
    }
    
    // ----------------------UPDATE FUNCTIONS---------------------------------
    
    public function updateSettingReminder($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET reminder = :reminder WHERE userId = :userId");
            $newId->bindValue(':reminder', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateSettingPushNotifications($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET pushNotifications = :pushNotifications WHERE userId = :userId");
            $newId->bindValue(':pushNotifications', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateSettingAllowMobileDataUsage($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET allowMobileDataUsage = :allowMobileDataUsage WHERE userId = :userId");
            $newId->bindValue(':allowMobileDataUsage', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateSettingAllowThemes($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET allowThemes = :allowThemes WHERE userId = :userId");
            $newId->bindValue(':allowThemes', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateSettingNotificationSound($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET notificationSound = :notificationSound WHERE userId = :userId");
            $newId->bindValue(':notificationSound', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateSettingSubscriptionType($values){
        try {
            $newId = parent::prepare("UPDATE loved_appSetting SET subscriptionType = :subscriptionType WHERE userId = :userId");
            $newId->bindValue(':subscriptionType', $values['setting']);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $res = $newId->execute();
            if($res){
                return $this->getAppSettings($values);
            }
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}
    }

    public function updateExpense($values){
        try {
            $newId = parent::prepare("UPDATE loved_Expenses SET expName = :expName,expType = :expType,expCost = :expCost,expDate = :expDate,symUser = :symUser,symId = :symId WHERE id = :id");
            $newId->bindValue(':expName', $values['expName']);
            $newId->bindValue(':expType', $values['expType']);
            $newId->bindValue(':expCost', $values['expCost']);
            $newId->bindValue(':expDate', $values['expDate']);
            $newId->bindValue(':symUser', $values['symUser']);
            $newId->bindValue(':symId', $values['symId']);
    
            $newId->bindParam(':id', $values['id'], PDO::PARAM_STR);
    
            return $newId->execute();
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}

    }

    
    public function updateFileIsProfileById($values){
        try {
            $newId = parent::prepare("UPDATE loved_Files SET isProfile = :isProfile WHERE userId = :userId");
            $newId->bindParam(':isProfile', $values['isProfile'], PDO::PARAM_STR);
            $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
    
            return $newId->execute();

        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}

    }
    public function addFile($values){

        // return $values;
        try {

            $values['dateCreated'] = date('Y-m-d H:i:s');
            $newId = parent::prepare("INSERT INTO loved_Files (filePath, fileType, userId, isProfile, dateCreated ) VALUES (:filePath, :fileType, :userId, :isProfile, :dateCreated )");
            $newId->bindValue(':filePath', $values['filePath']);
            $newId->bindValue(':fileType', $values['fileType']);
            $newId->bindValue(':userId', $values['userId']);
            $newId->bindValue(':isProfile', $values['isProfile']);
            // $newId->bindValue(':symId', $values['symId']);
            $newId->bindValue(':dateCreated', $values['dateCreated']);
            return $newId->execute();

        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}

    }




    public function updateProfileImage($values){

        $curr_date = date('Y-m-d H:i:s');
        $hash = md5($curr_date);
        $imgName = $values['userId'].'_'.$hash.'_proPic';
        $oldPicStatus = false;

        $image = $this->save_base64_image($values['profileImage'], $imgName, 'lovedOnesFiles');

        $fileArr['userId'] = $values['userId'];
        $fileArr['isProfile'] = 1;
        $preProImg = $this->getActiveProfileImage($fileArr);
    
        $activeCount = count($preProImg);
        
        if ($activeCount>0) {
            $fileArr2['userId'] = $values['userId'];
            $fileArr2['isProfile'] = 0;
            $oldPicStatus = $this->updateFileIsProfileById($fileArr2);
        }else{
            $oldPicStatus = true;
        }

        if($oldPicStatus){
            $imageArr['filePath'] = $image['path'];
            $imageArr['fileType'] = $image['extension'];
            $imageArr['userId'] = $values['userId'];
            $imageArr['symId'] = $values['symId'];
            $imageArr['isProfile'] = 1;

            $res1 = $this->addFile($imageArr);
            if($res1){
                $newData = $this->getActiveProfileImage($fileArr);
                // echo '<pre>';
                // print_r($newData);
                // echo '</pre>';
                // exit;
            }
        }
    
        return $newData;

    }

    public function updateProfile($values){
        $userUResp = $this->updateUserByEmail($values);
        if ($userUResp) {
            if($values['profileImage']=='undefined' ){  
                $newData = $this->getUserByEmail($values);
            } else{
                $result = $this->getUserByEmail($values);

                $resCount = count($result);

                if($resCount>0){

                    $curr_date = date('Y-m-d H:i:s');
                    $hash = md5($curr_date);
                    $imgName = $values['id'].'_'.$hash.'_proPic';
    
                    // echo '<pre>'.print_r($values['profileImage']).'</pre>';
                    
                    $image = $this->save_base64_image($values['profileImage'], $imgName, 'lovedOnesFiles');
                    
                    $fileArr['userId'] = $result[0]['id'];
                    $fileArr['isProfile'] = 1;
                    $preProImg = $this->getActiveProfileImage($fileArr);
    
                    $activeCount = count($preProImg);
                    
                    if ($activeCount>0) {
                        $fileArr2['userId'] = $result[0]['id'];
                        $fileArr2['isProfile'] = 0;
                        $this->updateFileIsProfileById($fileArr2);
                    }
    
                    $imageArr['filePath'] = $image['path'];
                    $imageArr['fileType'] = $image['extension'];
                    $imageArr['userId'] = $values['userId'];
                    $imageArr['symId'] = $values['symId'];
                    $imageArr['isProfile'] = 1;
                    $res1 = $this->addFile($imageArr);
                    if($res1){
                        $newData = $this->getUserByEmail($values);
                }
                    };
                
            }
            return $newData;
        }
    }
    public function memoryViewed($values){
        try {
            $values['viewStatus'] = 1;
            $values['isDeleted'] = 0;
            $newId = parent::prepare("UPDATE loved_memory SET viewStatus = :viewStatus WHERE :isDeleted = isDeleted AND :id = id");
            $newId->bindValue(':viewStatus', $values['viewStatus']);
            $newId->bindValue(':isDeleted', $values['isDeleted']);
            $newId->bindValue(':id', $values['id']);
    
            return $newId->execute();
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}

    }
    public function updateUserByEmail($values){
        try {

            if($values['userPassword'] != 'no_password'){
                $this->updatePassword($values);
            }
            $newId = parent::prepare("UPDATE loved_Users SET firstName = :firstName, lastName = :lastName, userName = :userName, mobileNumber = :mobileNumber, dateOfBirth = :dateOfBirth, country = :country WHERE symId = :symId AND :userEmail = userEmail");
            $newId->bindValue(':firstName', $values['firstName']);
            $newId->bindValue(':lastName', $values['lastName']);
            $newId->bindValue(':userName', $values['userName']);
            $newId->bindValue(':mobileNumber', $values['mobileNumber']);
            $newId->bindValue(':dateOfBirth', $values['dateOfBirth']);
            $newId->bindValue(':country', $values['country']);
            $newId->bindValue(':symId', $values['symId']);
            $newId->bindValue(':userEmail', $values['userEmail']);
    
            return $newId->execute();
        } catch (PDOException $e) {
			exit($e->getMessage());
			return 0;
		}

    }

    private function updatePassword($values){
        $salt = md5($this->currentDateTime);
        $passhash = hash('sha256', $salt.$values['password'].$salt);
        $newId = parent::prepare("UPDATE loved_Users SET userPassword = :userPassword WHERE symId = :symId AND :userEmail = userEmail");
        $newId->bindValue(':userPassword', $passhash);
        $newId->bindValue(':symId', $values['symId']);
        $newId->bindValue(':userEmail', $values['userEmail']);
        return $newId->execute();
    }

    private function updateDeviceUserByToken($values){
        $newId = parent::prepare("UPDATE loved_device SET userId = :userId WHERE deviceToken = :deviceToken");
        $newId->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
        $newId->bindValue(':deviceToken', $values['deviceToken']);
        $result = $newId->execute();
        return $result;
    }

    private function updateSendStatus($values){

        // echo '<pre>';
        // print_r($values);
        // echo '</pre>';
        // exit;

        $sendStatus = 1;
        $newId = parent::prepare("UPDATE loved_memory SET sendStatus = :sendStatus WHERE id = :id");
        $newId->bindParam(':sendStatus', $sendStatus, PDO::PARAM_STR);
        $newId->bindParam(':id', $values['id'], PDO::PARAM_STR);
        $result = $newId->execute();
        return $result;
    }
    
    // ----------------|| VIEW FUNCTIONS ||--------------------------------------------------------

    public function getOneUser($values){
        $values['isProfile'] = 1;
        $stmt = parent::prepare("SELECT firstName, lastName, userName, userEmail, mobileNumber, dateOfBirth, country, userType, symId, activationStatus, filePath FROM 
        loved_Users AS lu
        INNER JOIN loved_Files AS lf
        ON lu.id = lf.userId 
        WHERE :isProfile = isProfile AND :symId = symId and :id = lu.id");
        $stmt->bindParam(':isProfile', $values['isProfile'], PDO::PARAM_STR);
        $stmt->bindParam(':symId', $values['symId'], PDO::PARAM_STR);
        $stmt->bindParam(':id', $values['userId'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
//-------------------------------------------------------------------------
    public function getCard($values)
    {
        $stmt = parent::prepare("SELECT tokenizationID FROM loved_Payment_Card_Test AS a
        INNER JOIN loved_Users AS b 
        ON a.userId = b.id
        WHERE :userId = userId
        ORDER BY a.id DESC
        LIMIT 1
        ");
        $stmt->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getToken(){

        $stmt = parent::prepare("SELECT * FROM loved_Payment_Card");
        $stmt -> execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $responseData = array();

        foreach ($result as $row){
            array_push($responseData, array("id"=>$row[0],
                                            "tokenizationID"=>$row[1],
                                            "bin"=>$row[2],
                                            "lastDigits"=>$row[3],
                                            "cardHolder"=>$row[4],
                                            "expiryMonth"=>$row[5],
                                            "expiryYear"=>$row[6],
                                            "brand"=>$row[7],
                                            "userId"=>$row[8]));
        }

        return $responseData; 
    }
//---------------------------------------------------------------------------

    private function getUserByEmail($values){

        $values['isProfile']=1;
        $filepath = 'no_profileImage';
        $stmt = parent::prepare("SELECT id, firstName, lastName, userName, userEmail, mobileNumber, dateOfBirth, country, userType, symId, activationStatus FROM 
        loved_Users WHERE :userEmail = userEmail");
        $stmt->bindParam(':userEmail', $values['userEmail'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt2 = parent::prepare("SELECT filePath FROM 
        loved_Files WHERE :userId = userId AND :isProfile = isProfile");
        $stmt2->bindParam(':userId', $result[0]['id'], PDO::PARAM_STR);
        $stmt2->bindParam(':isProfile', $values['isProfile'], PDO::PARAM_STR);
        $stmt2->execute();
        $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($result2)) {
            $filepath = $result2[0]['filePath'];
        }
        $result[0]['filePath'] = $filepath;
        
        return $result[0];
    }

    public function getActiveProfileImage($values){  
        $stmt = parent::prepare("SELECT * FROM loved_Files WHERE :userId = userId AND :isProfile = isProfile");
        $stmt->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
        $stmt->bindParam(':isProfile', $values['isProfile'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function getAllUsers(){
        $stmt = parent::prepare("SELECT id, firstName, lastName, userEmail, mobileNumber, userPassword, userType, symId, activationStatus, dateCreated  FROM loved_Expenses");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
        echo $result;
    }

    public function getAppSettings($values){
        $stmt = parent::prepare("SELECT reminder, pushNotifications, allowMobileDataUsage, allowThemes, notificationSound, subscriptionType, userId FROM loved_appSetting WHERE :userId = userId");
        $stmt->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    
    public function getSubscriptions(){
        $stmt = parent::prepare("SELECT id, subcriptionName, amount, subDescription  FROM loved_subcriptionType");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    
    public function getSubscriptionById($values){
        $stmt = parent::prepare("SELECT * FROM loved_subcriptionType WHERE :id = id");
        $stmt->bindParam(':id', $values['id'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result[0]['id'];
    }
    private function getReceiverInfo($values){
        $stmt = parent::prepare("SELECT id, userType FROM loved_Users WHERE :userEmail = userEmail OR :mobileNumber = mobileNumber");
        $stmt->bindParam(':userEmail', $values['receiverEmail'], PDO::PARAM_STR);
        $stmt->bindParam(':mobileNumber', $values['receiverContactNumber'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result);
        return $result;
    }
    

    public function getReceivedMemories($values){
        $values['isDeleted'] = 0;
        $values['sendStatus'] = 1;
        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath ,recipientId, location,viewStatus ,sendStatus FROM loved_memory WHERE :recipientId = recipientId AND :sendStatus = sendStatus AND isDeleted = :isDeleted");
        $stmt->bindParam(':recipientId', $values['recipientId'], PDO::PARAM_STR);
        $stmt->bindParam(':sendStatus', $values['sendStatus'], PDO::PARAM_STR);
        $stmt->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // print_r($result);
        return $result;
    }

    // public function getAllMemories($values){
    //     return $this->getAllMemoriesData($values);
    // }

    public function getAllMemories($values){
        $values['isDeleted'] = 0;
        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath, deliveryDate, dateCreated ,recipientId, location ,viewStatus ,sendStatus FROM loved_memory WHERE :senderId = senderId OR :recipientId = recipientId AND isDeleted = :isDeleted");
        $stmt->bindParam(':senderId', $values['senderId'], PDO::PARAM_STR);
        $stmt->bindParam(':recipientId', $values['senderId'], PDO::PARAM_STR);
        $stmt->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resObj = array();
        $resObj2 = array();
        foreach ($result as $key) { 
            $stmt2 = parent::prepare("SELECT id AS `senderId`,firstName AS `senderFirstname`, lastName AS `senderLastname`, userEmail AS  `senderEmail`, mobileNumber AS  `senderMobileNumber` FROM loved_Users WHERE :id = id AND isDeleted = :isDeleted");
            $stmt2->bindParam(':id', $values['senderId'], PDO::PARAM_STR);
            $stmt2->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
            $stmt2->execute();
            $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            // echo '<pre>';
            // print_r($result2);
            // echo '</pre>';
            // exit;


            if (!empty($result2)) {
                foreach ($result2[0] as $key2 => $value2) {
                    $key[$key2] = $value2;
                }
                array_push($resObj, $key);
            }

        }

        foreach ($resObj as $key) { 
            $stmt3 = parent::prepare("SELECT firstName AS `receiverName`, lastName AS `receiverSurname`, userEmail AS  `receiverEmail`, mobileNumber AS  `receiverContactNumber` FROM loved_Users WHERE :id = id AND isDeleted = :isDeleted");
            $stmt3->bindParam(':id', $key['recipientId'], PDO::PARAM_STR);
            $stmt3->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
            $stmt3->execute();
            $result3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($result3)) {
                foreach ($result3[0] as $key3 => $value3) {
                    $key[$key3] = $value3;
                }
                array_push($resObj2, $key);
            }
        }

        // echo '<pre>';
        //     print_r($resObj2);
        //     echo '</pre>';
        //     exit;

        return $resObj2;
    }
    private function getOneMemoryById($values){
        $values['isDeleted'] = 0;
        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath, deliveryDate, dateCreated ,recipientId, location ,viewStatus ,sendStatus FROM loved_memory WHERE id = :id");
        $stmt->bindParam(':id', $values['id'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resObj = array();
        $resObj2 = array();
        foreach ($result as $key) { 
            $stmt2 = parent::prepare("SELECT id AS `senderId`,firstName AS `senderFirstname`, lastName AS `senderLastname`, userEmail AS  `senderEmail`, mobileNumber AS  `senderMobileNumber` FROM loved_Users WHERE :id = id AND isDeleted = :isDeleted");
            $stmt2->bindParam(':id', $values['senderId'], PDO::PARAM_STR);
            $stmt2->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
            $stmt2->execute();
            $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($result2)) {
                foreach ($result2[0] as $key2 => $value2) {
                    $key[$key2] = $value2;
                }
                array_push($resObj, $key);
            }

        }
                
        foreach ($resObj as $key) { 
            $data = $this->getReceipient($result[0]['recipientId']);
            if (!empty($data)) {
                foreach ($data[0] as $key3 => $value3) {
                    $key[$key3] = $value3;
                }
                array_push($resObj2, $key);
            }
        }

        return $resObj2;
    }


    public function getLatestMemories($values){
        $values['isDeleted'] = 0;
        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath, deliveryDate, dateCreated ,recipientId, location ,viewStatus ,sendStatus FROM loved_memory WHERE id > :id");
        $stmt->bindParam(':id', $values['id'], PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resObj = array();
        $resObj2 = array();
        foreach ($result as $key) { 
            $stmt2 = parent::prepare("SELECT id AS `senderId`,firstName AS `senderFirstname`, lastName AS `senderLastname`, userEmail AS  `senderEmail`, mobileNumber AS  `senderMobileNumber` FROM loved_Users WHERE :id = id AND isDeleted = :isDeleted");
            $stmt2->bindParam(':id', $values['senderId'], PDO::PARAM_STR);
            $stmt2->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
            $stmt2->execute();
            $result2 = $stmt2->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($result2)) {
                foreach ($result2[0] as $key2 => $value2) {
                    $key[$key2] = $value2;
                }
                array_push($resObj, $key);
            }

        }
                
        foreach ($resObj as $key) { 
            $data = $this->getReceipient($result[0]['recipientId']);
            if (!empty($data)) {
                foreach ($data[0] as $key3 => $value3) {
                    $key[$key3] = $value3;
                }
                array_push($resObj2, $key);
            }
        }

        return $resObj2;
    }


    private function getReceipient($id){
        $stmt3 = parent::prepare("SELECT id AS `receipientId`, firstName AS `receiverName`, lastName AS `receiverSurname`, userEmail AS  `receiverEmail`, mobileNumber AS  `receiverContactNumber` FROM loved_Users WHERE :id = id");
        $stmt3->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt3->execute();
        $result3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        return $result3;
    }


    public function getScheduledMemories($repeatDelivery){
        $values['isDeleted'] = 0;
        // $values['sendStatus'] = 0;
        $values['deliveryDate'] = '2021-01-18T10:48:33.146+02:00';
        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath ,imageMemoryPath ,reminder ,repeatDelivery ,deliveryDate ,senderId ,recipientId, location,sendStatus ,dateCreated FROM loved_memory WHERE repeatDelivery = :repeatDelivery AND isDeleted = :isDeleted");
        $stmt->bindParam(':repeatDelivery', $repeatDelivery, PDO::PARAM_STR);
        // $stmt->bindParam(':sendStatus', $values['sendStatus'], PDO::PARAM_STR);
        // $stmt->bindParam(':deliveryDate', $values['deliveryDate'], PDO::PARAM_STR);
        $stmt->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
        $stmt->execute();
        $result3 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result3;
    }
    public function getScheduledMemoriesOnce($repeatDelivery){
        $values['isDeleted'] = 0;
        $values['sendStatus'] = 0;
        $values['deliveryDate'] = '2021-01-18T10:48:33.146+02:00';

        $stmt = parent::prepare("SELECT id, memoryName ,memoryBody ,memoryType ,videoMemoryPath ,voiceMemoryPath ,imageMemoryPath ,reminder ,repeatDelivery ,deliveryDate ,senderId ,recipientId, location ,sendStatus ,dateCreated FROM loved_memory WHERE repeatDelivery = :repeatDelivery AND sendStatus = :sendStatus AND isDeleted = :isDeleted");
        $stmt->bindParam(':repeatDelivery', $repeatDelivery, PDO::PARAM_STR);
        $stmt->bindParam(':sendStatus', $values['sendStatus'], PDO::PARAM_STR);
        // $stmt->bindParam(':deliveryDate', $values['deliveryDate'], PDO::PARAM_STR);
        $stmt->bindParam(':isDeleted', $values['isDeleted'], PDO::PARAM_STR);
        $stmt->execute();
        $result3 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result3;
    }

    private function getDeviceByToken($values){
        $stmt3 = parent::prepare("SELECT deviceToken, userId FROM loved_device WHERE :deviceToken = deviceToken");
            $stmt3->bindParam(':deviceToken', $values['deviceToken'], PDO::PARAM_STR);
            $stmt3->execute();
            $result3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        return $result3;
    }

    private function getDeviceTokensByUserId($values){
        $stmt3 = parent::prepare("SELECT deviceToken, userId FROM loved_device WHERE :userId = userId");
            $stmt3->bindParam(':userId', $values['userId'], PDO::PARAM_STR);
            $stmt3->execute();
            $result3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        return $result3;
    }


    

   

// ___________________|| DELETE FUNCTIONS ||-------------------------------------------------------

    public function deleteUser($id){
        $stmt = parent::prepare("DELETE FROM loved_Users WHERE :id=id");
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->execute();
        return true;
    }

    public function deleteMemory($values){
        $stmt = parent::prepare("DELETE FROM loved_memory WHERE :id=id");
        $stmt->bindParam(':id', $values['id'], PDO::PARAM_STR);
        $stmt->execute();
        return true;
    }

    public function deleteExpense($id){
        $stmt = parent::prepare("DELETE FROM loved_Expenses WHERE :id=id");
        $stmt->execute();
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        return true;
    }


// _________________________****| Others |****________________________
    public function save_base64_image($base64_image_string, $output_file_without_extension, $folder,  $path_with_end_slash="" ) {
        //usage:  if( substr( $img_src, 0, 5 ) === "data:" ) {  $filename=save_base64_image($base64_image_string, $output_file_without_extentnion, getcwd() . "/application/assets/pins/$user_id/"); }      
        //
        //data is like:    data:image/png;base64,asdfasdfasdf
        // echo '<pre>'.print_r($base64_image_string).'</pre>';
        if (!file_exists($folder)){
            mkdir($folder, 0777, true);
        }
        $splited = explode(',', substr( $base64_image_string , 5 ) , 2);
        $mime=$splited[0];
        $data=$splited[1];
    
        $mime_split_without_base64=explode(';', $mime,2);
        $mime_split=explode('/', $mime_split_without_base64[0],2);
        $extension='';
        if(count($mime_split)==2)
        {
            $extension=$mime_split[1];
            if($extension=='jpeg')$extension='jpg';
            //if($extension=='javascript')$extension='js';
            //if($extension=='text')$extension='txt';
            $output_file_with_extension=$output_file_without_extension.'.'.$extension;
        }
        // echo '<pre>'.print_r($path_with_end_slash . $folder. '/' . $output_file_with_extension).'</pre>';
        file_put_contents( $path_with_end_slash . $folder . '/'. $output_file_with_extension, base64_decode($data) );
        $res = array('path'=> $folder.'/'.$output_file_with_extension, 'extension'=> $extension);
        return $res;
    }

    public function uploadFile($values){


       $nameStrId = explode("_", $values['name']);

        $upPath = 'lovedOnesFiles/'.$values['typeFolder'].'/'.$nameStrId['1'].'/';

        $tags = explode('/' ,$upPath);            // explode the full path
        $mkDir = "";

        foreach($tags as $folder) {          
            $mkDir = $mkDir . $folder ."/";   // make one directory join one other for the nest directory to make
            if(!is_dir($mkDir)) {             // check if directory exist or not
              mkdir($mkDir, 0777);            // if not exist then make the directory
            }
        }
        
      //  $upPath = "/home/etopzavg/lovedOnez.etopick.com/lovedOnesFiles/video/12/";

        return move_uploaded_file($values['tmp_name'], $upPath.$values['name']);

    }

    public function pushNotification($values, $deviceToken){
        #prep the bundle
        $fields = array
                (
                    'to'=> $deviceToken,
                    'notification'=> $values['message']
                );
        
        
        $headers = array
                (
                    'Authorization: key=' . $this->apiAccessKey,
                    'Content-Type: application/json'
                );
        
        #Send Reponse To FireBase Server	
            $ch = curl_init();
            curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
            curl_setopt( $ch,CURLOPT_POST, true );
            curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
            curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
            curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
            curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
            $result = curl_exec($ch );
            curl_close( $ch );
            return $result;
    
    }

    private function resolveMemorySend($values){

        $receiversData['userEmail'] = $values['receiverEmail'];

        $userData = $this->getUserByEmail($receiversData);

        $receiversData['userId'] = $userData['id'];

        $deviceTokens = $this->getDeviceTokensByUserId($receiversData);
        $emailSettings = array(
            'to'=> $values['receiverEmail'],
            'from'=>'noreply@lovedonez.bpslab.co.za',
            'subject'=>'Loved1ns Memory'.'-'.$values['id'],
            'body'=>'You have a memory Waiting for you on the Loved1ns app.',
        );

        $pushData['message'] = array
              (
            'body' => $values['memoryBody'],
            'title'=> $values['memoryName'].' '.$values['memoryType'],
            'icon'	=> 'myicon',/*Default Icon*/
            'sound' => 'mySound'/*Default sound*/
              );

        $result = $this->sendPushNotification($deviceTokens, $pushData);


        $this->sendEmail($emailSettings);

        
        return true;


    }

    public function sendScheduledMemory($values){

       $updateSendStatus = $this->updateSendStatus($values);

       if($updateSendStatus){
         $resolve =  $this->resolveMemorySend($values);
       }
        return $resolve;

    }


    //  -------| Memory Schedules |--------
    public function onetimeMemory(){
        $allScheduledMemories = $this->getScheduledMemoriesOnce('not_applicable');

        foreach ($allScheduledMemories as $key => $value) {

            $memoryDate = new DateTime($value['deliveryDate']);

            if($memoryDate < new DateTime()){ 

                $this->sendScheduledMemory($value);

            }
        }
    }

    public function weeklyScheduledMemory(){
        $allScheduledMemories = $this->getScheduledMemories('weekly');
 
        foreach ($allScheduledMemories as $key => $value) {     
            $memoryDate = new DateTime($value['deliveryDate']);

            // chech if the memory is the current day time of the week mon-sun
            if($memoryDate->format('D H:i') == $this->dateObj->format('D H:i')){
                $this->sendScheduledMemory($value);
            }
        }
    }

    public function monthlyScheduledMemory(){
        $allScheduledMemories = $this->getScheduledMemories('monthly');

        foreach ($allScheduledMemories as $key => $value) {
            $memoryDate = new DateTime($value['deliveryDate']);

            // check the current date-tme every month
            if($memoryDate->format('d H:i') == $this->dateObj->format('d H:i')){
                $this->sendScheduledMemory($value);
            }
        }
    }

    public function yearlyScheduledMemory(){
        $allScheduledMemories = $this->getScheduledMemories('yearly');   
        foreach ($allScheduledMemories as $key => $value) {

            $memoryDate = new DateTime($value['deliveryDate']);
            
            // Check the current month-date-time every year
            if($memoryDate->format('m-d H:i') == $this->dateObj->format('m-d H:i')){
                $this->sendScheduledMemory($value);
            }
        }
    }





    // Push Notifications

    public function sendPushNotification($deviceTokens, $pushData){
        foreach ($deviceTokens as $res) {
           $pushStr =  $this->pushNotification($pushData, $res['deviceToken']);
           $pushObj = json_decode($pushStr, true);

        }
        if($pushObj['success']){
            return true;
        }
    }


//__________****CREATE TABLE****____________
public function install(){
        $this->exec("CREATE TABLE IF NOT EXISTS loved_Users (
        id BIGINT AUTO_INCREMENT NOT NULL,
        firstName VARCHAR(30) NOT NULL,
        lastName VARCHAR(30) NOT NULL,
        userName VARCHAR(100) NOT NULL,
        userEmail VARCHAR(100) NOT NULL,
        mobileNumber VARCHAR(100),
        dateOfBirth VARCHAR(100),
        country VARCHAR(100),
        userPassword VARCHAR(100) NOT NULL,
        userType BIGINT NOT NULL,
        symId BIGINT NOT NULL,
        activationStatus BIGINT NOT NULL,
        dateCreated VARCHAR(100) NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_Files (
        id BIGINT AUTO_INCREMENT NOT NULL,
        filePath VARCHAR(200) NOT NULL,
        fileType VARCHAR(200) NOT NULL,
        userId BIGINT NOT NULL,
        isProfile INT  NOT NULL,  
        symId BIGINT NOT NULL,
        dateCreated VARCHAR(100) NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_appSetting (
        id BIGINT AUTO_INCREMENT NOT NULL,
        reminder VARCHAR(30),
        pushNotifications INT DEFAULT 1,
        allowMobileDataUsage  INT DEFAULT 1,
        allowThemes  INT DEFAULT 1,
        notificationSound  INT DEFAULT 50,
        subscriptionType  INT DEFAULT 1,
        userId BIGINT NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");
        
        $this->exec("CREATE TABLE IF NOT EXISTS loved_appSetting (
        id BIGINT AUTO_INCREMENT NOT NULL,
        reminder VARCHAR(30),
        pushNotifications INT DEFAULT 1,
        allowMobileDataUsage  INT DEFAULT 1,
        allowThemes  INT DEFAULT 1,
        notificationSound  INT DEFAULT 50,
        subscriptionType  INT DEFAULT 1,
        userId BIGINT NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");
        
        $this->exec("CREATE TABLE IF NOT EXISTS loved_memory (
        id BIGINT AUTO_INCREMENT NOT NULL,
        memoryName VARCHAR(80) NOT NULL,
        memoryBody VARCHAR(1000) NOT NULL,
        memoryType VARCHAR(50) NOT NULL,
        videoMemoryPath VARCHAR(200),
        voiceMemoryPath VARCHAR(200),
        imageMemoryPath VARCHAR(200),
        reminder VARCHAR(200),
        repeatDelivery VARCHAR(200),
        deliveryDate VARCHAR(200) NOT NULL,
        senderId BIGINT NOT NULL,
        recipientId BIGINT NOT NULL,
        location VARCHAR(200) NOT NULL,
        viewStatus INT NOT NULL DEFAULT 0,
        sendStatus INT NOT NULL DEFAULT 1,
        dateCreated VARCHAR(100) NOT NULL,
        isDeleted INT NOT NULL DEFAULT 0,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");


        $this->exec("CREATE TABLE IF NOT EXISTS loved_passwordrecovery (
        id BIGINT AUTO_INCREMENT NOT NULL,
        UserId VARCHAR(30) NOT NULL,
        Email VARCHAR(30) NOT NULL,
        Code VARCHAR(100) NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_device (
        id BIGINT AUTO_INCREMENT NOT NULL,
        deviceToken VARCHAR(500) NOT NULL,
        userId BIGINT NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_Payment_Card_Test (
            id BIGINT AUTO_INCREMENT NOT NULL,
            tokenizationID VARCHAR(100) NOT NULL,
            bin VARCHAR(20) NOT NULL,
            last4Digits VARCHAR(20) NOT NULL,
            cardHolder VARCHAR(100) NOT NULL,
            expiryMonth VARCHAR(20) NOT NULL,
            expiryYear VARCHAR(20) NOT NULL,
            brand VARCHAR(100) NOT NULL,
            userId BIGINT NOT NULL,
            PRIMARY KEY (id)
            );");

	}
public function install2(){
        // $this->exec("CREATE TABLE IF NOT EXISTS loved_Users (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // firstName VARCHAR(30) NOT NULL,
        // lastName VARCHAR(30) NOT NULL,
        // userName VARCHAR(100) NOT NULL,
        // userEmail VARCHAR(100) NOT NULL,
        // mobileNumber VARCHAR(100),
        // dateOfBirth VARCHAR(100),
        // country VARCHAR(100),
        // userPassword VARCHAR(100) NOT NULL,
        // userType BIGINT NOT NULL,
        // symId BIGINT NOT NULL,
        // activationStatus BIGINT NOT NULL,
        // dateCreated VARCHAR(100) NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");

        // $this->exec("CREATE TABLE IF NOT EXISTS loved_Files (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // filePath VARCHAR(200) NOT NULL,
        // fileType VARCHAR(200) NOT NULL,
        // userId BIGINT NOT NULL,
        // isProfile INT  NOT NULL,  
        // symId BIGINT NOT NULL,
        // dateCreated VARCHAR(100) NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");

        // $this->exec("CREATE TABLE IF NOT EXISTS loved_appSetting (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // reminder VARCHAR(30),
        // pushNotifications INT DEFAULT 1,
        // allowMobileDataUsage  INT DEFAULT 1,
        // allowThemes  INT DEFAULT 1,
        // notificationSound  INT DEFAULT 50,
        // subscriptionType  INT DEFAULT 1,
        // userId BIGINT NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");
        
        // $this->exec("CREATE TABLE IF NOT EXISTS loved_appSetting (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // reminder VARCHAR(30),
        // pushNotifications INT DEFAULT 1,
        // allowMobileDataUsage  INT DEFAULT 1,
        // allowThemes  INT DEFAULT 1,
        // notificationSound  INT DEFAULT 50,
        // subscriptionType  INT DEFAULT 1,
        // userId BIGINT NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");
        
        // $this->exec("CREATE TABLE IF NOT EXISTS loved_memory (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // memoryName VARCHAR(80) NOT NULL,
        // memoryBody VARCHAR(1000) NOT NULL,
        // memoryType VARCHAR(50) NOT NULL,
        // videoMemoryPath VARCHAR(200),
        // voiceMemoryPath VARCHAR(200),
        // imageMemoryPath VARCHAR(200),
        // reminder VARCHAR(200),
        // repeatDelivery VARCHAR(200),
        // deliveryDate VARCHAR(200) NOT NULL,
        // senderId BIGINT NOT NULL,
        // recipientId BIGINT NOT NULL,
        // viewStatus INT NOT NULL DEFAULT 0,
        // sendStatus INT NOT NULL DEFAULT 1,
        // dateCreated VARCHAR(100) NOT NULL,
        // isDeleted INT NOT NULL DEFAULT 0,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");


        // $this->exec("CREATE TABLE IF NOT EXISTS loved_passwordrecovery (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // UserId VARCHAR(30) NOT NULL,
        // Email VARCHAR(30) NOT NULL,
        // Code VARCHAR(100) NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");

        // $this->exec("CREATE TABLE IF NOT EXISTS loved_device (
        // id BIGINT AUTO_INCREMENT NOT NULL,
        // deviceToken VARCHAR(500) NOT NULL,
        // userId BIGINT NOT NULL,
        // timeStamp TIMESTAMP NOT NULL,
        // PRIMARY KEY (id)
        // );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_subcriptionType (
        id BIGINT AUTO_INCREMENT NOT NULL,
        subcriptionName VARCHAR(100) NOT NULL,
        amount BIGINT NOT NULL,
        subDescription VARCHAR(500) NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

        $this->exec("CREATE TABLE IF NOT EXISTS loved_Payments (
        id BIGINT AUTO_INCREMENT NOT NULL,
        userId BIGINT NOT NULL,
        paymentType INT NOT NULL,
        dateSubscribed VARCHAR(100) NOT NULL,
        timeStamp TIMESTAMP NOT NULL,
        PRIMARY KEY (id)
        );");

	}

		//_________****REMOVE TABLES****__________
	public function unInstall(){

		// $this->exec("DROP TABLE loved_Expenses");
		// $this->exec("DROP TABLE loved_Users");
		// $this->exec("DROP TABLE loved_passwordrecovery");
		// $this->exec("DROP TABLE loved_Files");
		// $this->exec("DROP TABLE loved_appSetting");
		// $this->exec("DROP TABLE loved_memory");
		$this->exec("DROP TABLE loved_subcriptionType");
		$this->exec("DROP TABLE loved_Payments");
		// $this->exec("DROP TABLE Companies");
		// $this->exec("DROP TABLE userRoles");
	}


}
 ?>
