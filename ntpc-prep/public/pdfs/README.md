# PDF library

Put PDFs in these folders and commit them. The app lists everything here under **Library**.

| Folder | Use for |
|---|---|
| `syllabus/` | Official notification, syllabus, exam pattern |
| `pyq/` | Previous-year question papers and answer keys |
| `notes/` | Your own notes, formula sheets, current-affairs compilations |
| `books/` | Book chapters and reference material you are allowed to keep |
| `other/` | Anything else |

Add a file by dropping it in the folder, or from the project root run:

    npm run fetch-pdf -- <direct-pdf-url> pyq/ntpc-2025-shift1.pdf

`manifest.json` is rebuilt automatically on `npm run dev` and `npm run build`.
Only store papers and material you have the right to keep. Official RRB notices and papers are fine; copyrighted books are your call.
