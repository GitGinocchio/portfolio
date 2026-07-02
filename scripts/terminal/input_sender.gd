extends Sprite3D

@onready var animation = %AnimationPlayer
@onready var subviewport = %SubViewport

func _ready() -> void:
	pass

func _input(event):
	if GameState.is_at_pc:
		subviewport.push_input(event)
