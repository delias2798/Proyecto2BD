import pandas as pd
from langdetect import detect_langs
from langdetect.lang_detect_exception import LangDetectException

# Ruta del archivo
file_path = r'C:\Users\arein\Downloads\compefinal.csv'
data = pd.read_csv(file_path)

# Seleccionar las columnas clave, incluyendo Location
columns_to_keep = ['Title', 'What it Does', 'Built With', 'By', 'Location']
filtered_data = data[columns_to_keep]

# Eliminar registros con valores vacíos en las columnas seleccionadas
filtered_data = filtered_data.dropna(subset=columns_to_keep)

# Función para detectar si solo tiene inglés o español en secciones separadas
def has_only_english_or_spanish(text):
    try:
        # Dividimos el texto en dos partes
        middle_index = len(text) // 2
        part1 = text[:middle_index]
        part2 = text[middle_index:]
        
        # Detectar todos los idiomas en ambas partes
        detected_langs_part1 = detect_langs(part1)
        detected_langs_part2 = detect_langs(part2)

        # Verificar si ambos detectores solo contienen inglés o español
        for lang in detected_langs_part1 + detected_langs_part2:
            if lang.lang not in ['en', 'es']:
                return False

        # Si ambas partes son inglés o español, el texto es válido
        return True
    except LangDetectException:
        return False

# Filtrar registros no válidos
invalid_rows = filtered_data[~filtered_data['What it Does'].apply(has_only_english_or_spanish)]
if not invalid_rows.empty:
    print("Registros no válidos encontrados y eliminados:")
    print(invalid_rows)

# Filtrar registros válidos
filtered_data = filtered_data[filtered_data['What it Does'].apply(has_only_english_or_spanish)]

# Convertir todas las columnas seleccionadas a minúsculas para normalización
filtered_data = filtered_data.applymap(lambda s: s.lower() if type(s) == str else s)

# Guardar el nuevo archivo con solo las columnas seleccionadas y normalizadas
filtered_data.to_csv(r'C:\Users\arein\Downloads\archivo_filtrado_normalizado_final 7.csv', index=False)

print("Archivo filtrado, normalizado y guardado exitosamente.")