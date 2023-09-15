const {execSync} = require('child_process')
execSync("pnpm run build")

var FS = require('fs-extra');
var value = FS.readFileSync("./data/count.txt").toString()

var val = Number( value )
val += 1;

var init = async () => {

 const aedes = require("aedes")();
 const server = require("net").createServer(aedes.handle);
 const port = 1012;

 server.listen(port, function () {
 console.log("server started and listening on port ", port);
 open(port)
 });
 
};

var open = async ( prt ) =>{

 var bit;

 require("../998.terminal/998.terminal/000.quest.terminal");
 require("../000.aaads/000.aaads/000.quest.aaads");

 const MQTT = require("async-mqtt");

 var title = command_line();

 var local = 'mqtt://localhost:' + prt;

 var localBit = { idx: 'local', src: local }


 bit = await TERMINAL.hunt(TERMINAL.ActTrm.INIT_TERMINAL , {dat: MQTT, src:local} );
 
 bit = await AAADS.hunt( AAADS.ActAaa.INIT_AAADS , { val: 1, dat: MQTT, src:  [localBit]  });
 
}

var command_line = () => {
 var idx;
 const { program } = require("commander");
 program.option("--first").option("-t, --separator <char>");
 program.parse(process.argv);
 const options = program.opts();
 if (options["separator"] != null) idx = options["separator"];
 return idx;
};


process.nextTick(init)