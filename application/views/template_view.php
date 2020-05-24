<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>@import url('https://fonts.googleapis.com/css?family=Exo+2|Jura|Open+Sans+Condensed:300|Ubuntu+Condensed|Open+Sans:300');</style> 
		<link rel="shortcut icon" href="<?=$this->Root?>/images/authorplay-inverted.png" type="image/x-icon">
		<link rel="icon" href="<?=$this->Root?>/images/authorplay-inverted.png" type="image/x-icon">
		<title><?=$page_title?> | AuthorPlay</title>
		<?php
			$this->LoadCSS($this->Root . '/css/main.css');
		?>
		<script>var http_root = '<?=$this->Root?>';</script>
	</head>
	<body>
		<header>
			<div class="header-content">
				<a data-async="true" href="<?=$this->Root?>/home">
					<img src="<?=$this->Root?>/images/authorplay-transparent.svg" alt="AuthorPlay"/>
				</a>
				<div class="menu">
					<a data-async="true" href="<?=$this->Root?>/online"><span>Online</span></a>
					<a data-async="true" href="<?=$this->Root?>/home"><span>Home</span></a>
				</div>
			</div>
		</header>
		<div class="header-place"></div>
		<div class="loading"></div>
		<div class="bg-wrapper"></div>
		<div class="notify-wrapper"></div>
		<?php include 'application/views/'.$content_view; ?>
		<div class="player-hor-bg"></div>
		<footer class="player sd">
			<div class="wrapper">
				<div class="data">
					<div class="poster"></div>
					<div class="info">
						<span class="title">Title</span>
						<br>
						<span class="author">Author</span>
					</div>
				</div>
				<div class="controls">
					<button class="prev"></button>
					<button class="play"></button>
					<button class="next"></button>
				</div>
				<div id="progressBar">
					<div id="buffered"></div>
					<div id="progress"><span></span></div>
				</div>
				<div id="volumeBar"><div id="volume"><span></span></div></div>
			</div>
		</footer>
		<script src="/cdn/jquery.js"></script>
		<script src="/cdn/js.cookie.min.js"></script>
		<script src="/cdn/transit.js"></script>
		<script src="/cdn/anix.js"></script>
		<?php
			$this->LoadJS($this->Root . '/js/lib/jquery.form.js');
			$this->LoadJS($this->Root . '/js/lib/fibx.js');
			$this->LoadJS($this->Root . '/js/class.notify.js');
			$this->LoadJS($this->Root . '/js/poster.io.js');
			$this->LoadJS($this->Root . '/js/class.playlist.js');
			$this->LoadJS($this->Root . '/js/player.io.js');
			$this->LoadJS($this->Root . '/js/funct.io.js');
			$this->LoadJS($this->Root . '/js/async.page.js');
			$this->LoadJS($this->Root . '/js/screen.io.js');
			$this->LoadJS($this->Root . '/js/input.file.io.js');
			$this->LoadJS($this->Root . '/js/main.js');
		?>
	</body>
</html>