extends Sprite3D


@onready var animation = %AnimationPlayer
@onready var subviewport = %SubViewport

func _input(event):
	subviewport.push_input(event)
