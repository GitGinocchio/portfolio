extends ColorRect

@export var code_edit: CodeEdit
@export var blink_speed = 0.5
var timer = 0.0

@onready var font =  code_edit.get_theme_font("font")
@onready var font_size =  code_edit.get_theme_font_size("font_size")

func _ready() -> void:
	var line_height = font.get_height(font_size)
	self.custom_minimum_size = Vector2(2, line_height)
	
func _process(delta: float) -> void:
	var line_height = font.get_height(font_size)
	var caret_pos = code_edit.get_caret_draw_pos()
	
	var position_y = clamp(caret_pos.y - line_height, 0, 1032)
	self.position = Vector2(caret_pos.x, position_y)
		
	timer += delta
	
	if timer >= blink_speed:
		self.visible = !self.visible
		timer = 0.0
