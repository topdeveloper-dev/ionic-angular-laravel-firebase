<?php 

// echo "<pre>";

require_once('class.lovedOnez.php');
require_once('assets/countries/countries.php');
require 'vendor/autoload.php';
require_once('tokenAuth.php');
$int_x = 0;
$server_root = str_replace('\\','/',$_SERVER['DOCUMENT_ROOT']); 
$dir = str_replace('\\','/',dirname(__FILE__,2))."/"; 
$base_url = str_replace($server_root,"",$dir,$int_x);
use \Firebase\JWT\JWT; // Tokens
$tokenFuncs = new \Firebase\JWT\JWT;
//include "base_url.php"; //gets the base url 

define('BASE_URL', $base_url);
define('ROOT_URL', "https://lovedOnez.etopick.com/");
define('IMAGE_URL',"$base_url Uploads/");

$config = array(
    'db_type' => 'mysql',
    'db_host' => 'localhost',
    'db_name' => 'etopzavg_lovedOnez',
    'db_username' => 'etopzavg_lovedOnezAdmin',
    'db_password' => 't(KSRo&HSM#v',
    'apiAccessKey' => 'AAAA5zu5DXc:APA91bGlzRTYv87XV4IrNIYJym6Yb1cjqgY687lg5JvURg7NOtDkddIPQ_E7UUUlvKGsI-BrT15-1nknsyosi62d78XYmFZtXTuUk1TkJet8IJZUhavoXoijnmKWJOovTlEr3m9OuXDO',
);

$api = new lovedOnez($config);
$tokenHandler = new tokenAuth($tokenFuncs);






// $keysFromObject = array_keys(get_object_vars($_FILES[0]));


// echo json_encode($_POST);


// $_POST = array('action' => 'getCountries', 'values'=> array());

// $_POST =  array(
  //   'action' => 'createAccount',
  //   'firstName'=>'Kudakwashe2',
  //   'lastName'=>'Nheyera2',
//   'userName'=>'kuda_michael_n',
//   'userEmail'=>'kmnheykuil@gmail.com',
//   'mobileNumber'=> '223632
//   6322',
//   'dateOfBirth'=> date("Y-m-d"),
//   'country'=> 'sa',
//   'userPassword'=>'Qwerty!23',
//   'userId'=>'1',
//   'symId'=>'1',
//   'activationStatus'=> 1
// );
// $_POST =  array(
  //   'action' => 'pushTest',
  //   'deviceId'=>'eqk1-10aS2OTiDuXSrieaI:APA91bFqNjscSNNkqoO1XPof7SZ5BH4J4_2emuXIQ0EaWKA_O8HjTs8tvw_OOsSbbN-IBXddcf0-Nws9nBNg4xYPK5Vcz0oKM4DPjnbwuyA6ADFx4Dcz-JVezBosiX3ooQ5F-0w7zZ3N',
  // );
  // $_POST =  array(
    //   'action' => 'addSettings',
    //   'reminder'=>'1',
    //   'pushNotifications'=>'1',
    //   'allowMobileDataUsage'=>'1',
    //   'allowThemes'=>'1',
    //   'notificationSound'=>'1',
    //   'subscriptionType'=>'1',
    //   'userId'=>'12',
    // );
    // $_POST =  array(
      //   'action' => 'getAllMemories',
//   'senderId'=>'12',
// );
// $_POST =  array(
  //   'action' => 'updateSettingPushNotifications',
  //   'setting'=>'1',
  //   'userId'=>'12',
  // );
  // $_POST =  array(
    //   'action' => 'updateSettingReminder',
    //   'reminder'=>'monthly',
    //   'pushNotifications'=>'1',
    //   'allowMobileDataUsage'=>'1',
    //   'allowThemes'=>'1',
//   'notificationSound'=>'1',
//   'subscriptionType'=>'1',
//   'userId'=>'12',
// );
// $_POST =  array(
  //   'action' => 'addMemory',
  //   'memoryName'=> 'Greeting',
  //   'memoryBody'=> 'Complimence of the new season.',
  //   'memoryType'=> 'text',
  //   'videoMemoryPath'=> 'not_applicable',
  //   'voiceMemoryPath'=> 'not_applicable',
  //   'imageMemoryPath'=> 'not_applicable',
  //   'reminder'=> 'weekly',
  //   'repeatDelivery'=> 'yearly',
  //   'deliveryDate'=> 'now',
  //   'senderId'=> '12',
  //   'sendStatus'=> 1,
  //   'dateCreated'=> 'monthly',
  //   'receiverName'=> 'John',
  //   'receiverSurname'=> 'Doe',
  //   'receiverEmail'=> 'kmnheyera@gmail.com',
  //   'receiverContactNumber'=> '0827204874',
  // );
  // $_POST =  array(
    //   'action' => 'getActiveProfileImage',
    //   'userId'=>'12',
    //   'symId'=>'1',
    //   'isProfile'=>'1'
    // );
    // $_POST =  array(
      //   'action' => 'getUserByEmail',
      //   'userId'=>'12',
      //   'userEmail'=>'mnheyera@aolc.co.za',
      //   'isProfile'=>'1'
      // );
      // $_POST =  array(
//   'action' => 'getCountries',
//   'userEmail'=>'mnheyera@aolc.co.za',
//   'userPassword'=>'Qwerty!23',
//   'symId'=>'1',
//   'deviceToken'=>'deviceToken_Wjjbiu8767H',

// );
// $_POST =  array(
  //   'action' => 'loveLogin',
  //   'userEmail'=>'kmnheyera@gmail.com',
  //   'userPassword'=>'Qwerty!23',
  //   'deviceToken'=>'deviceToken_Wjjbiu8767H',
  //   'symId'=>1
  // );
  // $_POST =  array(
    //   'action' => 'addDeviceToken',
    //   'userId'=>'12',
    //   'deviceToken'=>'deviceToken_Wjjbiu8767H123456',
    // );
    // $_POST =  array(
      //   'action'=> "updateAccount",
      //   'country'=> "South Africa",
      //   'dateOfBirth'=> "1991-09-26T11:42:39.018+02:00",
      //   'firstName'=> "Micheal",
      //   'img'=> "empty",
      //   'lastName'=> "Nheyera",
      //   'mobileNumber'=> "827204874",
      //   'profileImage'=> "undefined",
      //   'symId'=> "1",
      //   'userEmail'=> "mnheyera@aolc.co.za",
      //   'userId'=> "12",
      //   'userName'=> "Kuda_Michael_N",
      //   'userPassword'=> "no_password",
      //   'userType'=> "1"
      // );
      
      //$_POST =  array(
        //   'action' => 'addCardDetails',
        //   'brand'=>'VISA',
//   'cardNumber'=>4200000000000000,
//   'holder'=>'kuda_michael_n',
//   'month'=>11,
//   'year'=> 2023,
//   'cvv'=>4328
// );

// echo json_encode($_POST);

// $masSet = array(
  //   'to' => 'kmnheyera@gmail.com',
  //   'from' => 'noreply@exp.kudamichaeln.online',
  //   'subject' => 'EXP test email',
  //   'body' => '123 Testing.'
  // );
  // $masSet = array(
    //   'to' => 'kmnheyera@gmail.com',
    //   'from' => 'noreply@exp.kudamichaeln.online',
    //   'subject' => 'EXP test email',
    //   'body' => '123 Testing.'
// );

// $api->sendEmail($masSet);

// $_POST = array('action' => 'install2' );
// $token = 'eJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIyMDcuMTgwLjE5My43MCIsImlhdCI6MTYxNjU4MDIwNCwibmJmIjoxNjE2NTgwMjA0LCJleHAiOjE2NDgxMTYyMDQsInRva2VuX3R5cGUiOiJiZWFyZXIifQ.zNbcAjIQqCcWqa8kFAukOqVGrM8OLcJolH-4O2OwKDw';






// print_r($_POST);


if(isset($_POST['action'])){ $action = $_POST['action']; }

$action = $_POST['action'];


if($_POST['action']=='loveLogin'){
  
}else{
  $token = apache_request_headers()['token'];
  $jwtObj = $tokenHandler->checkToken($token);
}

if($jwtObj['status']){
  // echo '<pre>';
  // print_r($token);
  // echo '</pre>';
}else{
  if($action == 'createAccount'){
    
    
  }else if($action == 'loveLogin'){
    
  }else if($action == 'forgotPassword'){
    
  }else{
    $response = ['response'=> $token];
    echo json_encode($response);
    exit;
  }
}


if($action == 'install'){
  
  $api->install(); 
  $response = ['response'=> 'tables-installed'];
	echo json_encode($response);

} elseif ($action == 'install2'){
	
  $api->install2();
  $response = ['response'=> 'tables-uninstalled'];
 echo json_encode($response);
   
}elseif ($action == 'uninstall'){
	
 	$api->unInstall();
 	$response = ['response'=> 'tables-uninstalled'];
	echo json_encode($response);
		
} elseif ($action == 'loveLogin'){
	
  $result = $api->expLogin($_POST);
  $response = ['response'=> $result];
  $jwt = $tokenHandler->generateToken($config['db_host']);
  $response['response']['token'] = $jwt;
  $jwtObj = $tokenHandler->checkToken($jwt);

  echo json_encode($response);
   
} elseif ($action == 'createAccount'){

  $result = $api->addUser($_POST);
  $response = ['response'=> $result];
  $jwt = $tokenHandler->generateToken($config['db_host'], $action);
  $jwtObj = $tokenHandler->checkToken($jwt, $action);
  echo json_encode($response);
   
} elseif ($action == 'updateAccount'){
	
  $result = $api->updateProfile($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateProfileImage'){
	
  $result = $api->updateProfileImage($_POST);
  $response = ['response'=> $result[0]];
  echo json_encode($response);
   
} elseif ($action == 'getActiveProfileImage'){
	
  $result = $api->getActiveProfileImage($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'getOneUser'){
	
  $result = $api->getOneUser($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'getReceivedMemories'){
	
  $result = $api->getReceivedMemories($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'getAllMemories'){
	
  $result = $api->getAllMemories($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
}elseif ($action == 'getLatestMemories'){	

  $result = $api->getLatestMemories($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
  
} elseif ($action == 'syncMemories'){
  
  $memoryData = json_decode('['.$_POST['memoryData'].']', true);
  $result = $api->syncMemories($memoryData);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'forgotPassword'){
	
  $result = $api->recoverEmail($_POST['userEmail']);
  $response = ['response'=> $result];
  $jwt = $tokenHandler->generateToken($config['db_host']);
  // $response['token'] = $jwt;
  $jwtObj = $tokenHandler->checkToken($jwt);
  echo json_encode($response);
   
} elseif ($action == 'addExpense'){
	
  $api->addExpense($_POST);
  $response = ['response'=> 'expense-added'];
  echo json_encode($response);
   
} elseif ($action == 'addCardDetails'){

  $result = $api->addCardDetails($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
  
} elseif ($action == 'proccessdPayment'){
  $result = $api->proccessdPayment($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);

} elseif ($action == 'getCard'){

//   $newval = ['newval'=> $action, 'post'=> $_POST];
// echo json_encode($newval);
// exit;
  $result = $api->getCard($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
  
} elseif ($action == 'getToken'){

  $result = $api->getCard($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
  
} elseif ($action == 'addUser'){
	
  $api->addUser($_POST);
  $response = ['response'=> 'User-added', 'post'=> $_POST];
  echo json_encode($response);
   
} elseif ($action == 'getSubscriptionsTypes'){
	
  $result = $api->getSubscriptions($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateExpenses'){
	
  $api->updateExpense($_POST);
  $response = ['response'=> 'expense-updated'];
  echo json_encode($response);
   
} elseif ($action == 'getAllExpenses'){	

  // echo $api->getAllExpenses();
   
} elseif ($action == 'getCountries'){	

  $result = getCountries();
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'addSettings'){	

  $result = $api->addSettings($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'getAppSettings'){	

  $result = $api->getAppSettings($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'addMemory'){	

  $result = $api->addMemory($_POST);
  $response = ['response'=> $result];

  $jsonDec = json_decode($base64dec);
  echo json_encode($response);
  
} elseif ($action == 'deleteMemory'){	

  $result = $api->deleteMemory($_POST);
  $response = ['response'=> $result];

  echo json_encode($response);
  
} elseif (key($_FILES) == 'file'){	

   $response = 0;
     
  $mimeType = $_FILES['file']['type'];
   
  if(strstr($mimeType, "audio/")){
      
    $_FILES['file']['typeFolder'] = 'audio';
    $result = $api->uploadFile($_FILES['file']);
    $response = ['response'=> $result]; 
    
  } else if(strstr($mimeType, "video/")){
      
    $_FILES['file']['typeFolder'] = 'video';
    $result = $api->uploadFile($_FILES['file']);
    $response = ['response'=> $result]; 
    
  }
  
  echo json_encode($response);
   
} elseif ($action == 'updateSettingReminder'){

  $result = $api->updateSettingReminder($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateSettingPushNotifications'){

  $result = $api->updateSettingPushNotifications($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateSettingAllowMobileDataUsage'){

  $result = $api->updateSettingAllowMobileDataUsage($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateSettingAllowThemes'){	

  $result = $api->updateSettingAllowThemes($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateSettingNotificationSound'){	

  $result = $api->updateSettingNotificationSound($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'memoryViewed'){	

  $result = $api->memoryViewed($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);
   
} elseif ($action == 'updateSettingSubscriptionType'){	

  $result = $api->updateSettingSubscriptionType($_POST);
  $response = ['response'=> $result];
  echo json_encode($response);

} else {

	echo 'Undefined action '.$action;

}

 ?>