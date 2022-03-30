<?php
spl_autoload_register(function($class) {
  
  $class = str_replace("\\", DIRECTORY_SEPARATOR, $class);
  $file = dirname(__FILE__) . "/" . $class . '.php';  
  
  if (!file_exists($file)) {
    return false;
  }

  include $file;

});