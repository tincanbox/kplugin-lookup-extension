export default class SharedLib {
  find_scheme_field_id(fcode, src){
    var fcol = src || cybozu.data.page.FORM_DATA.schema.table.fieldList;
    var ret;
    for(var k in fcol){
      var fld = fcol[k];
      if(fld["var"] == fcode){
        ret = k;
        break;
      }
    }
    return ret;
  }

  find_matched_lookup(fid){
    for(var a of cybozu.data.page.FORM_DATA.lookups){
      if(a.keyMapping.fieldId == fid){
        return a;
      }
    }
  }

}
