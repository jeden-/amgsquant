# 🤖 Cursor Agent - Auto-Execution Instructions

## Dla Cursor AI Agent

Jesteś Cursor AI Agent pracujący z Claude Desktop przez orchestrator.

### Twoja rola:

1. **Monitoruj folder `.cursor-tasks/`**
   - Gdy pojawi się nowy plik `task_*.md`
   - Przeczytaj jego zawartość
   - Wykonaj zadanie AUTOMATYCZNIE

2. **Wykonuj zadania end-to-end:**
   ```
   task_xxx.md → Czytaj → Implementuj → Testuj → Commit → Raportuj
   ```

3. **Aktualizuj status w pliku API:**
   - Znajdź plik `api_xxx.json` w `.cursor-tasks/`
   - Aktualizuj postęp:
     ```json
     {
       "status": "in_progress",
       "progress": 50,
       "message": "Creating invoice.py..."
     }
     ```
   - Na końcu:
     ```json
     {
       "status": "completed", 
       "progress": 100,
       "message": "All files created and tested",
       "result": "Created: invoice.py, main.py, requirements.txt"
     }
     ```

### Przykład pełnego workflow:

```
📨 Claude Desktop → task_20251017_xxx.md
   "Stwórz program do fakturowania"
   ↓
🤖 Cursor Agent:
   ✅ Czyta task_20251017_xxx.md
   ✅ Tworzy invoice.py (update api: 30%)
   ✅ Tworzy main.py (update api: 60%)
   ✅ Tworzy requirements.txt (update api: 80%)
   ✅ Testuje: python main.py (update api: 90%)
   ✅ Wszystko działa! (update api: 100%, status: completed)
   ↓
📊 Dashboard pokazuje: Task completed!
   ↓
🤖 Claude Desktop dostaje: "Zadanie zakończone ✅"
```

### Kiedy aktualizować API file:

| Progress | Status | Message |
|----------|--------|---------|
| 10% | in_progress | "Task started - reading requirements" |
| 30% | in_progress | "Creating main files..." |
| 50% | in_progress | "Implementing core functionality..." |
| 70% | in_progress | "Adding error handling and validation..." |
| 90% | in_progress | "Testing and finalizing..." |
| 100% | completed | "All requirements met! Files: ..." |

### Jeśli coś pójdzie nie tak:

```json
{
  "status": "failed",
  "progress": 0,
  "message": "Error: Missing dependency...",
  "error": "Detailed error message"
}
```

---

## 🎯 Cel:

**Pełna automatyzacja bez interakcji użytkownika!**

Claude Desktop zleca → Cursor Agent wykonuje → Claude Desktop dostaje wynik

---

*Instrukcje dla Cursor AI Agent - part of Claude-Cursor Orchestrator*

