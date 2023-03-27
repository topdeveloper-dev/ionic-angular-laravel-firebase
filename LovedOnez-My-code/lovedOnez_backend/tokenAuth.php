<?php
class tokenAuth{
    public function __construct($config)
    {
        $this->jwtHandler = $config;
    }

    public function generateToken($serverUrl, $key = "example_key"){
    
        $tokenExp = "+24 hours";
        if($key== 'createAccount'){
            $tokenExp = "+1 hours";
        }
        $iat = strtotime(date('YmdHms', strtotime("+1 minutes")));
        $nbf = strtotime(date('YmdHms', strtotime("+1 minutes")));
        $exp = strtotime(date('YmdHms', strtotime($tokenExp)));
        // $exp = strtotime(date('YmdHms', strtotime($tokenExp)));
        $payload = array(
            "iss" => $serverUrl,
            "iat" => $iat,
            "nbf" => $nbf,
            "exp" => $exp,
            "token_type"=> "bearer",
        );

        return $this->jwtHandler::encode($payload, $key);
        
        
    }
    public function checkToken($token, $key = "example_key"){
    try {
    // print_r($jwt);
    $decoded = $this->jwtHandler::decode($token, $key, array('HS256'));
    //code...
    $decoded_array = (array) $decoded;

    http_response_code(200);
    $res = array(
        "status" => 1,
        "message" =>  $decoded_array,
    );
    // JWT::$leeway = 60; // $leeway in seconds
    // $decoded = JWT::decode($jwt, $key, array('HS256'));
    } catch (\Exception $extension) {
        http_response_code(500);
        $res = array(
            "status" => 0,
            "message" => $extension->getMessage(),
        );
    }

    return $res;

    }

}