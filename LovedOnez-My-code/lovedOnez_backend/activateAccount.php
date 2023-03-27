<?php   
	include_once "serverSet/appsettings.php";
    $settings = new appSettings();
    $app =  $settings->lvSym();

    $symId = 1;
    $createUserstatus = false;

    $login_error_message = '';
    $login = false;	

    $firstName = '';
    $lastName = '';

    if($_SERVER['REQUEST_METHOD']==='GET' && !empty($_GET['id'])&& !empty($_GET['code'])){

        $values = array(
            'id'=> $_GET['id'],
            'code'=> $_GET['code']
        );

        $res = $app->activateUser($values);

        if ($res == 0){
        }else{
            $createUserstatus = true;
            $firstName = $res[0]['firstName'];
            $lastName = $res[0]['lastName'];

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
    <!-- <link rel="icon" type="image/png" sizes="16x16" href="../assets/images/favicon.png"> -->
    <title>Loved 1z - Activate Account.</title>
    <!-- Bootstrap Core CSS -->
    <link href="assets/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link href="assets/css/style.css" rel="stylesheet">
    <!-- You can change the theme colors from here -->
    <link href="assets/css/colors/blue.css" id="theme" rel="stylesheet">
    
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
       
            <?php if( $createUserstatus== true){ ?>
            <div class="card welcomeCard">
                <div class="card-header">
                  Account Activated
                </div>
                <div class="card-body">
                  <h4 class="card-title">Hi  <?php echo $firstName.' '.$lastName; ?></h4>
                  <p class="card-text">Your account has now been activated, please proceed to the Login page on you app.</p>
                </div>
              </div>
            <?php } ?>

            <?php if( $createUserstatus== false){ ?>
            <div class="card welcomeCard">
                <div class="card-header">
                  Oops
                </div>
                <div class="card-body">
                  <h4 class="card-title">Sorry </h4>
                  <p class="card-text">Request UnKnown!!.</p>
                </div>
              </div>
            <?php } ?>
                            
      
        
    
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