<?php require('./api/config.php') ?>
<!DOCTYPE html>
<html lang = "en">
<head>
	<meta charset = "UTF-8">
	<title>Jervis</title>
	<!-- Tell the browser to be responsive to screen width -->
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<link rel="shortcut icon" href="<?php echo $config->assets ?>icons/favicon.png" type="image/x-icon" />
	<!-- jQuery UI -->
	<link rel="stylesheet" href="<?php echo $config->assets ?>jquery-ui/jquery-ui.min.css" >
	<link rel="stylesheet" href="<?php echo $config->assets ?>jquery-ui/jquery-ui.theme.min.css" >
	<!-- Bootstrap 3.3.6 -->
	<link rel="stylesheet" href="<?php echo $config->assets ?>bootstrap/css/bootstrap.min.css">
	<!-- Fonts -->
	<link rel="stylesheet" href="<?php echo $config->assets ?>fonts/source-sans-pro/font.css">
	<link rel="stylesheet" href="<?php echo $config->assets ?>fonts/font-awesome-4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="<?php echo $config->assets ?>fonts/ionicons-2.0.1/css/ionicons.min.css">
	<!-- Combined Plugins and AdminLTE -->
	<link rel="stylesheet" href="<?php echo $config->assets ?>plugins.min.css">
	<link rel="stylesheet" href="<?php echo $config->assets ?>plugins/iCheck/all.css">
	<link rel="stylesheet" href="<?php echo $config->assets ?>app.css?ver=<?php echo $config->version ?>">
	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->
</head>

<body class="hold-transition skin-blue sidebar-mini">
	<div id="app" class="wrapper"></div>

	<script type="text/javascript" src="<?php echo $config->assets ?>jquery-2.2.3.min.js"></script>
	<script type="text/javascript" src="<?php echo $config->assets ?>vendor.bundle.js?ver=<?php echo $config->version ?>"></script>
	<script type="text/javascript" src="<?php echo $config->assets ?>plugins.min.js?ver=<?php echo $config->version ?>"></script>
	<script type="text/javascript">
		this.Config = {
			root: '<?php echo $config->root ?>',
			admin: '<?php echo $config->admin ?>',
			api:	'<?php echo $config->api ?>',
			assets: '<?php echo $config->assets ?>',
			uploads: '<?php echo $config->uploads ?>',
			version: '<?php echo $config->version ?>'
		};
	</script>
	<script type="text/javascript" src="<?php echo $config->assets ?>misc.js?ver=<?php echo $config->version ?>"></script>
	<script type="text/javascript" src="<?php echo $config->assets ?>app.min.js?ver=<?php echo $config->version ?>"></script>
	
	<!-- Used for detecting Bootstrap screen size breakpoint using JS -->
	<div class="device-xs visible-xs"></div>
	<div class="device-sm visible-sm"></div>
	<div class="device-md visible-md"></div>
	<div class="device-lg visible-lg"></div>
	
</body>
</html>