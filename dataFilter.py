import pandas as pd
from langdetect import detect_langs
from langdetect.lang_detect_exception import LangDetectException

file_path = r'..\Gemini API Competition - muestra.csv.csv'
data = pd.read_csv(file_path)

# Seleccionar las columnas clave, incluyendo Location
columns_to_keep = ['Title', 'What it Does', 'Built With', 'By', 'Location']
filtered_data = data[columns_to_keep]

# Eliminar registros con valores vacíos en las columnas seleccionadas
filtered_data = filtered_data.dropna(subset=columns_to_keep)

# Función para detectar si solo tiene inglés o español y no otros idiomas
def has_only_english_or_spanish(text):
    try:
        # Detectar todos los idiomas en el texto
        detected_langs = detect_langs(text)
        # Verificar si todos los idiomas detectados son inglés ('en') o español ('es')
        for lang in detected_langs:
            if lang.lang not in ['en', 'es']:
                return False
        return True
    except LangDetectException:
        return False

# Filtrar registros válidos: aquellos que solo tienen inglés o español
invalid_rows = filtered_data[~filtered_data['What it Does'].apply(has_only_english_or_spanish)]
if not invalid_rows.empty:
    print("Registros no válidos encontrados y eliminados:")
    print(invalid_rows)

# Filtrar registros válidos
filtered_data = filtered_data[filtered_data['What it Does'].apply(has_only_english_or_spanish)]

# Convertir todas las columnas seleccionadas a minúsculas para normalización
filtered_data = filtered_data.applymap(lambda s: s.lower() if type(s) == str else s)

# Guardar el nuevo archivo con solo las columnas seleccionadas y normalizadas
filtered_data.to_csv(r'archivo_filtrado_normalizado.csv', index=False)

print("Archivo filtrado, normalizado y guardado exitosamente.")
