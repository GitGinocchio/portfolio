extends Node3D

@onready var animation = %AnimationPlayer
@onready var camera = %Camera3D

var mouse_sensitivity = 0.002
var yaw = 0.0
var pitch = 0.0
var target_yaw = 0.0
var target_pitch = 0.0

var max_angle = deg_to_rad(50) 
var lerp_speed = 5.0

func _input(event):
	if event is InputEventMouseMotion:
		target_yaw += event.relative.x * mouse_sensitivity
		target_pitch += event.relative.y * mouse_sensitivity
		
		target_yaw = clamp(target_yaw, -max_angle, max_angle)
		target_pitch = clamp(target_pitch, -max_angle, max_angle)

func _process(delta):
	yaw = lerp(yaw, target_yaw, lerp_speed * delta)
	pitch = lerp(pitch, target_pitch, lerp_speed * delta)
	
	if !animation.is_playing():
		camera.position.y = pitch
		camera.position.x = yaw
