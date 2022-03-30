<?php

use PhpParser\Error;
use PhpParser\NodeDumper;
use PhpParser\ParserFactory;

// Component: Dashboard
$app->post('/dashboard/', 'Dashboard');
$app->get('/dashboard/', 'Dashboard');


$app->get('/parser/', function(){
  $code = file_get_contents(FSCOM . "Dashboard/index.php");
  $parser = (new ParserFactory)->create(ParserFactory::PREFER_PHP7);
  try {
      $ast = $parser->parse($code);
  } catch (Error $error) {
      echo "Parse error: {$error->getMessage()}\n";
      return;
  }

  $dumper = new NodeDumper;
  return $ast;
});

$app->get('/tables/', function() use($db) {
  return $db->getTables();
});