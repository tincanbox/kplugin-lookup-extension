import SharedLib from '../lib/shared.js';

(function(k, factory) {
  'use strict';

  factory(new Kluginn.default());

})(kintone, function(p){

  const shared = new SharedLib;

  var K = p;
  var $ = K.$;
  var S = {
    config: K.config.fetch()
  };

  K.init().then(main);

  /* Put kintone-event listener on top level.
   *
   * K.$k.events.on()
   */

  function main(){
  }

  K.$k.events.on('app.record.create.show', function(e){
    update(e);
    return e;
  });

  K.$k.events.on('app.record.index.edit.show', function(e){
    update(e);
    return e;
  });

  K.$k.events.on('app.record.edit.show', function(e){
    update(e);
    return e;
  });


  K.api.fetch('app/form/fields')
    .then(function(p){
      for(var k in p.properties){
        K.$k.events.on([
          'app.record.create.change.' + k,
          'app.record.edit.change.' + k,
          'app.record.index.change.' + k
        ], function(e){
          update(e);
          return e;
        });
      }
    });


  function update(e){
    var lks = cybozu.data.page.FORM_DATA.lookups;
    var tbl = S.config.json.table;
    for(var a of tbl){
      var fcode = a.target;
      var fid = shared.find_scheme_field_id(fcode);
      var lk = shared.find_matched_lookup(fid);

      if(lk){
        var cond = lk.query.condition;
        var tapp = lk.targetApp;
        var mcond = match_target_cond(a, cond);
        if(mcond){
          mcond.value.value = _.template(a.value)({
            record: e.record,
            target_app: tapp,
            lookup: lk,
          });
        }
      }
    }
  }

  function match_target_cond(a, cond){
    if(cond.children){
      for(var aa of cond.children){
        var mm = match_target_cond(a, aa);
        if(mm){
          return mm;
        }
      }
    }else{
      if(cond.value){
        var pat = "%" + a.name + "%";
        if(cond.lookup_extension_pattern == pat || cond.value.value == pat){
          cond.lookup_extension_pattern = pat;
          return cond;
        }else{
        }
      }else{
      }
    }
    return;
  }

});
