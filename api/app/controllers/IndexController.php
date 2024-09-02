<?php
namespace AuthorPlay;

use WeRtOG\FoxyMVC\Attributes\Action;
use WeRtOG\FoxyMVC\Controller;
use WeRtOG\FoxyMVC\ControllerResponse\JsonView;

class IndexController extends Controller
{
  #[Action]
  public function Index(): JsonView
  {
    return new JsonView([
      'ok' => true,
      'code' => 200
    ]);
  }
}