# valico-backend

Part of this ecosystem
![alt text](https://github.com/pierrotagency/valico-admin/blob/master/doc/ecosystem.jpg?raw=true)

Valico backend with NodeJs, Adonis (Almost a Laravel in NodeJS), and JWT session so i can play with multiple fronts (stateless session)
(MYSQL for now)

## Install

```bash
npm install
```

### .env (put an accesible database params)
```bash
cp .env.example .env
```

### Migrations
```bash
adonis migration:run
```

### Key
```bash
adonis key:generate
```

## Run
```bash
npm run dev
```