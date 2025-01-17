extends Control

func _ready():
	var window = get_window().get_size()
	var viewport = get_viewport_rect()
	var window_position = (viewport.size - window * DisplayServer.screen_get_dpi()) / 2
	get_window().position = window_position
	var _conn = get_tree().connect("connected_to_server", Callable(self, "_connected_to_server"))
	_conn = get_tree().connect("server_disconnected", Callable(self, "_server_disconnected"))
	_conn = get_tree().connect("connection_failed", Callable(self, "connection_failed"))

func join_server():
	print("trying to join...")
	var client = ENetMultiplayerPeer.new()
	var err = client.create_client("127.0.0.1",4242)
	if err != OK:
		print("unable_to_connect")
		return
	get_tree().network_peer = client

func connection_failed(_id):
	print("Connection failed")

func _server_disconnected(_id):
	print("Server disconnected")

func _connected_to_server():
	print("Connected! Let's game!")
	#send client details, metrics
	var _mobile = OS.has_feature("mobile")
	if(_mobile):
		var _user_id = OS.get_unique_id()
		var _name = OS.get_name()
		var _model = OS.get_model_name()
		var _screen = DisplayServer.screen_get_size()
		var _scale = DisplayServer.screen_get_scale()
		rpc("server_process_data", _user_id)
	
	#get server details
	
	#switch to menu or gameplay
