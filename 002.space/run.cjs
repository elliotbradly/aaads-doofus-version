const {execSync} = require('child_process')
execSync("pnpm run build")

var FS = require('fs-extra');
var value = FS.readFileSync("./data/count.txt").toString()

var val = Number( value )
val += 1;

//end compile source code

var init = async () => {

  const aedes = require("aedes")();
  const server = require("net").createServer(aedes.handle);
  const port = 1123;

  server.listen(port, function () {
    console.log("server started and listening on port ", port);
    open(port)
  });

};

var bit;


var open = async (prt) => {

  require("../998.terminal/998.terminal/000.quest.terminal");
  require("../002.space/002.space/000.quest.space");

  const MQTT = require("async-mqtt");

  var title = command_line();

  var local = 'mqtt://localhost:' + prt;
  var localBit = { idx: 'local', src: local }
  var remoteBit = { idx: 'remote', src: 'ws://gatorsocket.herokuapp.com/' }


  bit = await TERMINAL.hunt(TERMINAL.ActTrm.INIT_TERMINAL, { dat: MQTT, src: local });
  //bit = await SPACE.hunt(SPACE.ActSpc.INIT_SPACE, { val: 1, dat: MQTT, src:  [localBit, remoteBit] });
  bit = await SPACE.hunt(SPACE.ActSpc.INIT_SPACE, { val: 1, dat: MQTT, src:  [localBit] });

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