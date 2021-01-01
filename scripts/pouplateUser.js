conn = Mongo('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false');
db = conn.getDB("scalert");
db.Users.insertMany([
  {
    Email: "arpit@abc.com",
    Libraries: [ "Corretto", "JBoss" ],

  },
   {
    Email: "albert@abc.com",
    Libraries: [ "Corretto", "JBoss","nginix" ],

  },
   {
    Email: "pinto@abc.com",
    Libraries: [ "OpenFire", "Node" ],

  }
])