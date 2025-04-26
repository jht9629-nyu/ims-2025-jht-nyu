# comments

- example of storing basic data to Firebase using the moLib library
- other examples here in [moSalon repo](https://github.com/molab-itp/moSalon)

- file: index.html
  - library molib include
  - source for the library in this [moLib repo](https://github.com/molab-itp/moLib)

```
<script type="module" src="https://unpkg.com/itp-molib@0.2.44/dist/moLib.esm.js?v=31"></script>
```

- file: js/setup_dbase.js
  - function to setup the database
  - adjust to your firebaseConfig
  - functions to add / access / remove comments

```
async function setup_dbase() {
...
  // Settings for document folders to store in database
  // Adjust for to define your store
  //
  my.mo_app = 'mo-photo';
  my.mo_room = 'm0-photo';
  my.mo_group = 's0';
...
```
