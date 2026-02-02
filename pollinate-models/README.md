# Aplikacja webowa agencji modelingowej - Pollinate Models

## Opis projektu
Projekt stanowi autorską aplikację webową wspierającą funkcjonowanie agencji modelingowej.
System umożliwia zarządzanie użytkownikami o różnych rolach (administrator, modelka, fotograf), obsługę profili użytkowników, zgłoszeń do sesji fotograficznych oraz komunikację pomiędzy uczestnikami systemu za pomocą czatu w czasie rzeczywistym.

Aplikacja została zaprojektowana w architekturze klient–serwer z wykorzystaniem nowoczesnych technologii webowych, co zapewnia bezpieczeństwo danych, przejrzystość struktury oraz możliwość dalszego rozwoju systemu.

---

## Wykorzystane technologie
- **Frontend:** React, HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Baza danych:** MySQL
- **Autoryzacja:** JWT (JSON Web Token)
- **Przesyłanie plików:** Multer
- **Komunikacja w czasie rzeczywistym:** Socket.io
- **Kontrola wersji:** Git

---

## Wymagania systemowe
Aby uruchomić aplikację na nowym komputerze, należy zainstalować:

- **Node.js** (wersja LTS)
- **npm** (instalowany razem z Node.js)
- **MySQL Server**
- **MySQL Workbench**
- **Przeglądarka internetowa** (Chrome, Firefox lub Edge)

---

## Instalacja wymaganych narzędzi

### 1. Instalacja Node.js i npm
Pobrać i zainstalować Node.js z oficjalnej strony: https://nodejs.org 

Sprawdzenie poprawności instalacji:
```bash
node -v
npm -v
```

---

### 2. Instalacja MySQL
Zainstalować MySQL Server oraz MySQL Workbench z oficjalnej strony: https://dev.mysql.com/downloads/

Podczas instalacji należy zapamiętać:

- nazwę użytkownika (np. root)
- hasło do bazy danych
- port (domyślnie 3306)

---

### 3. Instalacja zależności projektu
W katalogu głównym projektu przejść do folderu `pollinate-models`, a następnie uruchomić w nim terminal i wykonać:
```bash
cd pollinate-models
npm install
```

Polecenie instaluje wszystkie zależności wymagane do uruchomienia aplikacji frontendowej i backendowej.

---

## Uruchomienie aplikacji

### 1. Uruchomienie części frontendowej (React)
W katalogu projektu:
```bash
npm start
```

Aplikacja frontendowa będzie dostępna pod adresem:
```bash
http://localhost:3000
```

### 2. Uruchomienie backendu (Node.js)
W katalogu projektu, w osobnym oknie terminala, uruchomić:
```bash
node server.js
```

Backend odpowiada za:

- logikę biznesową aplikacji,
- autoryzację i uwierzytelnianie użytkowników,
- komunikację z bazą danych,
- obsługę czatu w czasie rzeczywistym.

---

## Przywracanie bazy danych (MySQL)
Aby aplikacja mogła poprawnie działać, należy przywrócić bazę danych z pliku kopii zapasowej `backup.sql`.

Instrukcja przywracania bazy danych (MySQL Workbench):
1. Uruchomić MySQL Workbench i połączyć się z serwerem MySQL.
2. Utworzyć nową bazę danych (np. `pollinate_models`).
3. Z menu wybrać **Server -> Data Import**.
4. Zaznaczyć opcję **Import from Self-Contained File** i wskazać plik `backup.sql`.
5. Wybrać utworzoną bazę danych jako docelową.
6. Kliknąć **Start Import** i poczekać na zakończenie procesu.

Po poprawnym imporcie baza danych jest gotowa do pracy z aplikacją.

---

## Uwagi końcowe
- MySQL Server musi być uruchomiony przed startem backendu, a dane dostępowe do bazy danych muszą być zgodne z konfiguracją w pliku `server.js`.
- Frontend i backend muszą działać jednocześnie, aby aplikacja funkcjonowała poprawnie.
- Wszystkie zależności Node.js powinny być zainstalowane w katalogu projektu za pomocą `npm install`. Dotyczy to również **Socket.io**, który odpowiada za komunikację w czasie rzeczywistym między frontendem a backendem.
- W przypadku problemów z połączeniem lub funkcjonalnością czatu należy upewnić się, że wersja Node.js jest zgodna z wymaganiami projektu oraz że pakiety npm zostały zainstalowane bez błędów.
