<?php

	include_once "serverSet/appsettings.php";
    $settings = new appSettings();
    $app =  $settings->lvSym();

    $symId = 1;
    $createPasswordstatus = false;

    $getStatus = false;

    if(isset($_GET['id']) && isset($_GET['code'])){
        $getStatus = true;
    }



    $login_error_message = '';
    $login = false;	

    $username = '';

    if($_SERVER['REQUEST_METHOD']==='POST' && !empty($_POST['submit']) && !empty($_POST['id'])  && !empty($_POST['code'])){
        $getStatus = true;
        if(preg_match('/[!@#$%*a-zA-Z0-9]{8,}/',$_POST['password']) && preg_match_all('/[0-9]/',$_POST['password']) > 0){
            $values = array(
                'id'=> $_POST['id'],
                'code'=> $_POST['code'],
                'password'=> $_POST['password']
            );
            $res = $app->changePasswordRecovery($values);
            $resCount = count($res);

            if($resCount>0){
                $username = $res[0]['firstName']." ".$res[0]['lastName'];
                $createPasswordstatus=true;
            }

        } else{
            $login_error_message='Passeord must have aleast 8 charactors, aleast one special charecter and atleast one Number';
        }

        
      

    }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <!-- Favicon icon -->
    <!-- <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon.png"> -->
    <title>Loved 1z System Change Password</title>
    <!-- Bootstrap Core CSS -->
    <link href="assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
    <!-- You can change the theme colors from here -->
    <link href="/css/colors/blue.css" id="theme" rel="stylesheet">
    
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body>
    <style>
        .welcomeCard {
            margin: auto;
            width: 70%;
            /* border: 3px solid green; */
            padding: 10px;
        }
    </style>
    <!-- ============================================================== -->
    <!-- Preloader - style you can find in spinners.css -->
    <!-- ============================================================== -->
    <div class="preloader">
        <svg class="circular" viewBox="25 25 50 50">
            <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" /> </svg>
    </div>
    <!-- ============================================================== -->
    <!-- Main wrapper - style you can find in pages.scss -->
    <!-- ============================================================== -->
    <section id="wrapper">
        <div class="login-register" style="background-image:url(../assets/images/background/login-register.jpg);">
        
        <?php if(!$getStatus){ ?> 

        <div class="card welcomeCard">
            <div class="card-header">
            Opps
            </div>
            <div class="card-body">
            <h4 class="card-title">Request Unknown</h4>    
            </div>
        </div>
                        
        <?php } ?>
        <?php if($getStatus){ ?> 
        <?php if($createPasswordstatus){ ?> 

            <div class="card welcomeCard">
                <div class="card-header">
                  Password Changed
                </div>
                <div class="card-body">
                  <h4 class="card-title">Hi <?php echo $username; ?></h4>
                  <p class="card-text">You Password has been successfully changed, please proceed to Log In on the Loved 1z App.</p>
                </div>
              </div>
                            
        <?php } ?>
        
        <?php if(!$createPasswordstatus){?>
            <div class="login-box card">
                <div class="card-body">
                    <form class="form-horizontal form-material" id="myForm" method="post" action="ChangePassword">
                        <h3 class="box-title m-b-20">Change Password</h3>
                       
                        <input  type="text" hidden required="" name="id" value="<?php echo $_GET['id']?>" placeholder="Password">
                        <input  type="text" hidden required="" name="code" value="<?php echo $_GET['code']?>" placeholder="Confirm Password">

                        <div class="form-group ">
                            <div class="col-xs-12">
                                <input class="form-control" type="password" required="" name="password" placeholder="Password">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-xs-12">
                                <input class="form-control" type="password" required="" name="confirmPassword" placeholder="Confirm Password">
                            </div>
                        </div>
           
                        <div class="form-group text-center m-t-20">
                            <div class="col-xs-12">
                                <!-- <button class="btn btn-info btn-lg btn-block text-uppercase waves-effect waves-light" type="submit">Sign Up</button> -->
                                <input type="submit" id="mysubmit" name="submit" class="" value="Submit"> 
                                    <?php
                                        if ($login_error_message != "") {
                                            echo '<br /><div class="alert alert-danger"><strong>Error: </strong> ' . $login_error_message . '</div>';
                                        }
                                    ?>
                                </div>
                        </div>
              
                    </form>
                </div>
            </div>
                <?php }?>
                <?php }?>
        </div>
    </section>
    <!-- ============================================================== -->
    <!-- End Wrapper -->
    <!-- ============================================================== -->
    <!-- ============================================================== -->
    <!-- All Jquery -->
    <!-- ============================================================== -->
    <script src="assets/plugins/jquery/jquery.min.js"></script>
    <!-- Bootstrap tether Core JavaScript -->
    <script src="assets/plugins/bootstrap/js/popper.min.js"></script>
    <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
    <!-- slimscrollbar scrollbar JavaScript -->
    <script src="assets/js/jquery.slimscroll.js"></script>
    <!--Wave Effects -->
    <script src="assets/js/waves.js"></script>
    <!--Menu sidebar -->
    <script src="assets/js/sidebarmenu.js"></script>
    <!--stickey kit -->
    <script src="assets/plugins/sticky-kit-master/dist/sticky-kit.min.js"></script>
    <script src="assets/plugins/sparkline/jquery.sparkline.min.js"></script>
    <!--Custom JavaScript -->
    <script src="assets/js/custom.min.js"></script>
    <!-- ============================================================== -->
    <!-- Style switcher -->
    <!-- ============================================================== -->
    <script src="assets/plugins/styleswitcher/jQuery.style.switcher.js"></script>
    <!-- <script src="../utilities/utilities.js"></script> -->
    <script>

    </script>
</body>

</html>