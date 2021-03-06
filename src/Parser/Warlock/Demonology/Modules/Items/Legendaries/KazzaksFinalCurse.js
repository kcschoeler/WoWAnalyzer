import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';
import calculateEffectiveDamage from 'Parser/Core/calculateEffectiveDamage';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';

import ItemDamageDone from 'Interface/Others/ItemDamageDone';

import DemoPets from '../../WarlockCore/Pets';

const DAMAGE_BONUS_PER_PET = 0.05;

// TODO: verify it still works with new Doom

// !!damage multiplier is assigned at the time of DAMAGE
// works with dreadstalkers, imps, felguard, grimoire: felguard
// DOESN'T work with demonic tyrant, vilefiend
class KazzaksFinalCurse extends Analyzer {
  static dependencies = {
    demoPets: DemoPets,
  };

  _dooms = [
    // {id, instance, damageBonus}
  ];
  bonusDmg = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasWaist(ITEMS.KAZZAKS_FINAL_CURSE.id);
  }

  // damage multiplier is decided when doom is CAST or REFRESHED, not when it deals damage
  on_byPlayer_applydebuff(event) {
    if (event.ability.guid !== SPELLS.DOOM_TALENT.id) {
      return;
    }
    const pets = this.demoPets.getPets(event.timestamp);
    const bonus = pets.length * DAMAGE_BONUS_PER_PET;
    let doom = this._dooms.find(doom => doom.id === event.targetID && doom.instance === event.targetInstance);
    if (!doom) {
      doom = {
        id: event.targetID,
        instance: event.targetInstance,
        damageBonus: bonus,
      };
      this._dooms.push(doom);
    }
    else {
      doom.damageBonus = bonus;
    }
  }

  on_byPlayer_refreshdebuff(event) {
    if (event.ability.guid !== SPELLS.DOOM_TALENT.id) {
      return;
    }
    const pets = this.demoPets.getPets(event.timestamp);
    const bonus = pets.length * DAMAGE_BONUS_PER_PET;
    const doom = this._dooms.find(doom => doom.id === event.targetID && doom.instance === event.targetInstance);
    if (!doom) {
      // shouldn't happen, we add the debuff on cast
      return;
    }
    doom.damageBonus = bonus;
  }

  on_byPlayer_damage(event) {
    if (event.ability.guid !== SPELLS.DOOM_DAMAGE.id) {
      return;
    }
    const doom = this._dooms.find(doom => doom.id === event.targetID && doom.instance === event.targetInstance);
    if (!doom) {
      // shouldn't happen, we add the debuff on cast
      return;
    }
    this.bonusDmg += calculateEffectiveDamage(event, doom.damageBonus);
  }

  item() {
    return {
      item: ITEMS.KAZZAKS_FINAL_CURSE,
      result: <ItemDamageDone amount={this.bonusDmg} />,
    };
  }
}

export default KazzaksFinalCurse;
