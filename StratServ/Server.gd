extends Node

func _ready():
	OS.center_window()
	with_multiplayerapi()

func with_multiplayerapi():
	var server = NetworkedMultiplayerENet.new()
	var err = server.create_server(4242)
	if err != OK:
		print("Unable to start server")
		return
	get_tree().network_peer = server
	var _conn = get_tree().connect("network_peer_connected", self, "_player_connected")
	_conn = get_tree().connect("network_peer_disconnected", self, "_player_disconnected")
	print("Server created")
	
func _player_connected(id):
	print("Player connected: ", id)

func _player_disconnected(id):
	print("Player disconnected: ", id)
