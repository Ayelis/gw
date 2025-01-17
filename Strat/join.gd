extends Button

@onready var sound_player = get_node("/root/main/SoundPlayer")
@onready var lobby = get_node("/root/main/lobby")
@onready var gameplay = get_node("/root/main/gameplay")

func _pressed():
	#log into the server with a random id
	Server.join_server()
	#play the button sound
	sound_player.play()
	#hide the lobby node
	lobby.visible = false
	# Show the gameplay node
	gameplay.visible = true
