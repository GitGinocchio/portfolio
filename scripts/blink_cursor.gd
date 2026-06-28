extends ColorRect

@export var code_edit: CodeEdit
var timer = 0.0
var blink_speed = 0.5

func _ready() -> void:
	var font = code_edit.get_theme_font("font")
	var line_height = font.get_height(code_edit.get_theme_font_size("font_size"))
	self.custom_minimum_size = Vector2(2, line_height)

func _process(delta: float) -> void:
	var caret_pos = code_edit.get_caret_draw_pos()
	var line_height = code_edit.get_theme_font("font").get_height(code_edit.get_theme_font_size("font_size"))
	
	# Imposta la posizione: 
	# caret_pos.x = posizione orizzontale corretta
	# caret_pos.y + line_height - altezza_cursore = allinea al fondo della riga
	self.position = Vector2(caret_pos.x, caret_pos.y + line_height - self.size.y)
	timer += delta
	
	if timer >= blink_speed:
		self.visible = !self.visible
		timer = 0.0
