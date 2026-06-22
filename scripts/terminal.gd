extends Node

@onready var camera = %Camera3D

func start_zoom_out() -> void:
	# 1. Creiamo il Tween
	var tween = create_tween().set_parallel(true)
	
	# 2. Impostiamo una curva di transizione (Cubic è la più naturale)
	tween.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN_OUT)
	
	# 3. Zoom out della posizione (spostiamo la camera indietro)
	tween.tween_property(camera, "position", Vector3(0, 1.5, 3.0), 2.0)
	
	# 4. Zoom out del FOV (cambiamo la prospettiva da "zoomata" a "wide")
	tween.tween_property(camera, "fov", 75.0, 2.0)
	
	# 5. Opzionale: Ruotiamo leggermente la camera per inquadrare meglio la stanza
	tween.tween_property(camera, "rotation_degrees", Vector3(-15, 0, 0), 2.0)

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta: float) -> void:
	pass
