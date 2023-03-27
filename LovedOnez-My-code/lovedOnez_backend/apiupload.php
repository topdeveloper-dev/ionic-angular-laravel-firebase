<?php 
 header('Access-Control-Allow-Origin: *');
 
  $nameStrId = explode("_", basename($_FILES['file']['name'])); 
 $upPath = 'lovedOnesFiles/video/' .$nameStrId[1].'/' ;
 
  $tags = explode('/' ,$upPath);            // explode the full path
        $mkDir = "";

        foreach($tags as $folder) {          
            $mkDir = $mkDir . $folder ."/";   // make one directory join one other for the nest directory to make
            if(!is_dir($mkDir)) {             // check if directory exist or not
              mkdir($mkDir, 0777);            // if not exist then make the directory
            }
        }
        
 $target_path = $upPath;
 $target_path = $target_path . basename( $_FILES['file']['name']);
 
 if(move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
     
    header('Content-type: application/json');
    
     $data = ['success' => true, 'message' => 'Upload and move success'];
         
         echo json_encode( $data ); 
         
    } else { 
        
         header('Content-type: application/json'); 
         $data = ['success' => false, 'message' => 'There was an error uploading the file, please try again!'];
         echo json_encode( $data ); 
   } 
?>