extends Node

signal player_stood_up
var is_at_pc: bool = true

func _ready() -> void:
	GameState.player_stood_up.connect(func(): is_at_pc = false)
