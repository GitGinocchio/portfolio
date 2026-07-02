extends Node3D

@onready var animation = %AnimationPlayer

func _ready() -> void:
	GameState.player_stood_up.connect(on_player_stand_up)

func on_player_stand_up():
	animation.play('standup')
