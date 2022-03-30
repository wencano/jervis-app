<?php

$timestart = microtime(true);

class Router {
  
  private static $routes = array();
  private function __construct() {}
  private function __clone() {}
  
    public static function route($pattern, $callback) {
    $pattern = '/' . str_replace('/', '\/', $pattern) . '/';
    self::$routes[$pattern] = $callback;
  }

  public static function execute($url) {
    echo $url; 
    echo "<pre>" . print_r(self::$routes, true) . "</pre>";
    foreach (self::$routes as $pattern => $callback) {
      if (preg_match($pattern, $url, $params)) {
        array_shift($params);
        return call_user_func_array($callback, array_values($params));
      }
    }
  }
}


Router::route('blog/(\w+)/(\w+)', function($category, $id){
  global $timestart; 
  echo $category . ':' . $id . "<br />";
  $timeend = microtime(true);
  echo ( $timeend - $timestart ) * 1000; 
});

Router::execute("http://example.com/blog/php/312/");


