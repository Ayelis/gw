extends Node

@onready var music_player = get_node("/root/main/MusicPlayer")

func center_window() -> void:
	# Get the current window
	var window = get_window()
	# And get the current screen the window's in
	var screen = window.current_screen
	# Get the usable rect for that screen
	var screen_rect = DisplayServer.screen_get_usable_rect(screen)
	# Get the window's size
	var window_size = window.get_size_with_decorations()
	# Set its position to the middle
	window.position = screen_rect.position + (screen_rect.size / 2 - window_size / 2)

func _ready():
	#figure out screen details and center
	#get var _screen = screen_get_size()
	#get var _scale = screen_get_scale()
	center_window()
	#do resize stuff?
	var _conn = get_tree().connect("screen_resized", Callable(self, "_on_screen_resized"))
	#play music
	#check permissions (and handle?)
	#get var _debug if build is test
	#get var _perms for app permissions

#func _on_screen_resized():
	#get var parent_size as window size
	#get var button_size as button size
	#set var center_position = (parent_size - button_size) / 2
	#set $lobby/join.rect_min_position = center_position
	#stop music
