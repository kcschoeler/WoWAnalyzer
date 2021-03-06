import React from 'react';

import ExpandableStatisticBox from 'Interface/Others/ExpandableStatisticBox';
import { STATISTIC_ORDER } from 'Interface/Others/StatisticBox';

import HIT_TYPES from 'Parser/Core/HIT_TYPES';
import Analyzer from 'Parser/Core/Analyzer';

import SpellLink from 'common/SpellLink';
import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import { formatNumber, formatPercentage } from 'common/format';

const SPELLS_PROCCING_RESURGENCE = {
  [SPELLS.HEALING_SURGE_RESTORATION.id]: 0.006,
  [SPELLS.HEALING_WAVE.id]: 0.01,
  [SPELLS.CHAIN_HEAL.id]: 0.0025,
  [SPELLS.UNLEASH_LIFE_TALENT.id]: 0.006,
  [SPELLS.RIPTIDE.id]: 0.006,
};
const MAX_MANA = 20000;

class Resurgence extends Analyzer {
  regenedMana = 0;
  otherManaGain = 0;
  resurgence = [];
  totalResurgenceGain = 0;

  on_byPlayer_heal(event) {
    const spellId = event.ability.guid;
    const isAbilityProccingResurgence = SPELLS_PROCCING_RESURGENCE.hasOwnProperty(spellId);

    if (!isAbilityProccingResurgence || event.tick) {
      return;
    }

    if (!this.resurgence[spellId]) {
      this.resurgence[spellId] = {
        spellId: spellId,
        resurgenceTotal: 0,
        castAmount: 0,
      };
    }

    if (event.hitType === HIT_TYPES.CRIT) {
      this.resurgence[spellId].resurgenceTotal += SPELLS_PROCCING_RESURGENCE[spellId] * MAX_MANA;
      this.resurgence[spellId].castAmount += 1;
    }
  }

  on_toPlayer_energize(event) {
    const spellId = event.ability.guid;

    if (spellId !== SPELLS.RESURGENCE.id) {
      this.otherManaGain += event.resourceChange;
      return;
    }

    this.totalResurgenceGain += event.resourceChange;
  }

  get totalMana() {
    this.regenedMana = ((this.owner.fightDuration / 1000) / 5) * 800;

    return this.regenedMana + this.totalResurgenceGain + MAX_MANA + this.otherManaGain;
  }

  statistic() {
    return (
      <ExpandableStatisticBox
        icon={<SpellIcon id={SPELLS.RESURGENCE.id} />}
        value={`${formatNumber(this.totalResurgenceGain)}`}
        label="Mana gained from Resurgence"
      >
        <div>
          <SpellLink id={SPELLS.RESURGENCE.id} iconStyle={{ height: '1.25em' }} /> accounted for {formatPercentage(this.totalResurgenceGain / this.totalMana, 0)}% of your mana pool ({formatNumber(this.totalMana)} mana).
        </div>
        <table className="table table-condensed" style={{ fontWeight: 'bold' }}>
          <thead>
            <tr>
              <th>Spell</th>
              <th>Amount</th>
              <th>Crits</th>
              <th>% of mana</th>
            </tr>
          </thead>
          <tbody>
            {
              this.resurgence
                .map(spell => (
                  <tr key={spell.spellId}>
                    <th scope="row"><SpellIcon id={spell.spellId} style={{ height: '2.5em' }} /></th>
                    <td>{formatNumber(spell.resurgenceTotal)}</td>
                    <td>{formatNumber(spell.castAmount)}</td>
                    <td>{formatPercentage(spell.resurgenceTotal / this.totalMana)}%</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </ExpandableStatisticBox>
    );
  }
  statisticOrder = STATISTIC_ORDER.UNIMPORTANT(90);
}

export default Resurgence;
