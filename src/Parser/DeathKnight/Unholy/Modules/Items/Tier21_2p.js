import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import SpellIcon from 'common/SpellIcon';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

class Tier21_2p extends Analyzer {
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.UNHOLY_DEATH_KNIGHT_T21_2SET_BONUS.id);
  }

  on_byPlayer_damage(event){
    const spellId = event.ability.guid;
    if(spellId !== SPELLS.COILS_OF_DEVASTATION.id){
      return;
    }
    this.damage += event.amount + (event.absorbed || 0);
  }

  item() {
    return {
      id: `spell-${SPELLS.UNHOLY_DEATH_KNIGHT_T21_2SET_BONUS.id}`,
      icon: <SpellIcon id={SPELLS.UNHOLY_DEATH_KNIGHT_T21_2SET_BONUS.id} />,
      title: <SpellLink id={SPELLS.UNHOLY_DEATH_KNIGHT_T21_2SET_BONUS.id} icon={false} />,
      result: <ItemDamageDone amount={this.damage} />,
    };
  }
}

export default Tier21_2p;
