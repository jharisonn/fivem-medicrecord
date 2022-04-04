fx_version 'adamant'

game 'gta5'

description 'Medical Information System'

version '1.0.0'

server_scripts {
    'server/main.lua'
}

client_scripts {
	'client/main.lua'
}

ui_page 'html/index.html'

files {
	'html/index.html',

	'html/css/styles.css',
	'html/css/bootstrap.css',
	'html/css/font-awesome.css',

	'html/js/app.js',
	'html/js/bootstrap.js',
	'html/js/popper.js'
}
