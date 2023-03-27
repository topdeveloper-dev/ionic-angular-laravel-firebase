<?php
require_once('./class.lovedOnez.php');
$int_x = 0;
$server_root = str_replace('\\','/',$_SERVER['DOCUMENT_ROOT']); 
$dir = str_replace('\\','/',dirname(__FILE__,2))."/"; 
$base_url = str_replace($server_root,"",$dir,$int_x);
//include "base_url.php"; //gets the base url 

define('BASE_URL', $base_url);
define('ROOT_URL', "https://lovedonez.bpslab.co.za/");
define('IMAGE_URL',"$base_url Uploads/");
class appSettings{
    public function lvSym(){
        $config = array(
            'db_type' => 'mysql',
            'db_host' => '207.180.193.70',
            'db_name' => 'bpslabco_lovedOnez',
            'db_username' => 'bpslabco_lovedOnezAdmin',
            'db_password' => '%[cAl$MnL3&P'
        );
        $api = new lovedOnez($config);
        return $api;
    }
}