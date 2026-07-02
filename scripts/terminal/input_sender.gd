extends Sprite3D

@onready var animation = %AnimationPlayer
@onready var subviewport = %SubViewport

func _ready() -> void:
	GameState.on_startup.connect(on_boot_animation_requested)

func on_boot_animation_requested():
	animation.play('bootlogo')

func _input(event):
	pass
	#subviewport.push_input(event)
