extends CharacterBody3D

const SPEED = 3
const JUMP_VELOCITY = 3
const MOUSE_SENSITIVITY = 0.003

@onready var neck := $Neck
@onready var camera := $Neck/Camera3D

var can_move_head: bool = true

func enable_head_movement() -> void:
	can_move_head = true

func disable_head_movement() -> void:
	can_move_head = false

func disable_player_collision() -> void:
	self.axis_lock_linear_y = true
	self.collision_mask = 0

func enable_player_collision() -> void:
	self.axis_lock_linear_y = false
	self.collision_mask = 1

func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED

func _unhandled_input(event: InputEvent) -> void:
	if Input.is_action_just_pressed("toggle_mouse") and OS.is_debug_build():
		if Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
		else:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	
	if not can_move_head: return
	
	if event is InputEventMouseButton and event.pressed:
		if Input.mouse_mode == Input.MOUSE_MODE_VISIBLE:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
			
	if event is InputEventMouseMotion and Input.mouse_mode == Input.MOUSE_MODE_CAPTURED:
		var is_at_pc = GameState.is_at_pc
		var sensitivity = MOUSE_SENSITIVITY * (0.1 if is_at_pc else 1.0)
		
		var limit_y = deg_to_rad(10) if is_at_pc else deg_to_rad(360)
		var limit_x = deg_to_rad(10) if is_at_pc else deg_to_rad(90)
		
		neck.rotate_y(-event.relative.x * sensitivity)
		camera.rotate_x(-event.relative.y * sensitivity)
		
		neck.rotation.y = clamp(neck.rotation.y, -limit_y, limit_y)
		camera.rotation.x = clamp(camera.rotation.x, -limit_x, limit_x)

func _physics_process(delta: float) -> void:
	if GameState.is_at_pc: return
		
	if not is_on_floor():
		velocity += get_gravity() * delta

	if Input.is_action_just_pressed("jump") and is_on_floor():
		velocity.y = JUMP_VELOCITY

	var input_dir := Input.get_vector("move_left", "move_right", "move_forward", "move_backward")
	
	var yaw_rotation : float = neck.global_transform.basis.get_euler().y
	var camera_basis := Basis.from_euler(Vector3(0, yaw_rotation, 0))
	var direction : Vector3 = (camera_basis * Vector3(input_dir.x, 0, input_dir.y)).normalized()
	
	if direction:
		velocity.x = direction.x * SPEED
		velocity.z = direction.z * SPEED
	else:
		velocity.x = move_toward(velocity.x, 0, SPEED)
		velocity.z = move_toward(velocity.z, 0, SPEED)

	move_and_slide()
