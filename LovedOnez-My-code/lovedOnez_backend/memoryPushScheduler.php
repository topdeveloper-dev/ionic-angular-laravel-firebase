<?php

require_once('class.lovedOnez.php');

$server_root = str_replace('\\','/',$_SERVER['DOCUMENT_ROOT']); 
$dir = str_replace('\\','/',dirname(__FILE__,2))."/"; 
$base_url = str_replace($server_root,"",$dir,$int_x);
//include "base_url.php"; //gets the base url 

define('BASE_URL', $base_url);
define('ROOT_URL', "https://lovedonez.bpslab.co.za/");
define('IMAGE_URL',"$base_url Uploads/");

$config = array(
    'db_type' => 'mysql',
    'db_host' => '207.180.193.70',
    'db_name' => 'bpslabco_lovedOnez',
    'db_username' => 'bpslabco_lovedOnezAdmin',
    'db_password' => '%[cAl$MnL3&P',
    'apiAccessKey' => 'AAAA5zu5DXc:APA91bGlzRTYv87XV4IrNIYJym6Yb1cjqgY687lg5JvURg7NOtDkddIPQ_E7UUUlvKGsI-BrT15-1nknsyosi62d78XYmFZtXTuUk1TkJet8IJZUhavoXoijnmKWJOovTlEr3m9OuXDO',
);

$api = new lovedOnez($config);


// $emailSettings = array(
//     'to'=>'mnheyera@aolc.co.za',
//     'from'=>'noreply@lovedonez.bpslab.co.za',
//     'subject'=>'Cron Test',
//     'body'=>'This is a test for a cron job for the loved1ns app',
// );


// one time schedule
$api->onetimeMemory();

// Weekly timed schedule
$api->weeklyScheduledMemory();

// Monthly timed schedule
$api->monthlyScheduledMemory();

// Yearly timed schedule
$api->yearlyScheduledMemory();







