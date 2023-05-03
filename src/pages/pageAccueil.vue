<template>
  <div class="row slider-container items-stretch q-pt-xl q-pb-xl" :class="{mobile: $q.screen.lt.sm}">
    <div class="slider">
      <span class="label">MATIN</span>
      <q-slider
        v-model="matin"
        color="secondary"
        markers
        snap
        :label-value="new Date(matin).toLocaleTimeString().slice(0, 5)"
        label-always
        switch-label-side
        track-color="secondary"
        selection-color="grey-5"
        :min=matinMinDate
        :max=matinMaxDate
        :step=900000
      />
    </div>

    <div class="separator q-px-md" v-show="$q.screen.gt.sm">
      <span class="label">09:00 - 11:30</span>
      <span class="ligne"></span>
    </div>

    <div class="slider">
      <span class="label">MIDI</span>
      <q-range
        v-model="midi"
        color="secondary"
        markers
        snap
        :left-label-value="new Date(midi.min).toLocaleTimeString().slice(0, 5)"
        :right-label-value="new Date(midi.max).toLocaleTimeString().slice(0, 5)"
        label-always
        switch-label-side
        drag-range
        track-color="secondary"
        selection-color="grey-5"
        :min=midiMinDate
        :max=midiMaxDate
        @pan="this.checkMaxTempsPause"
        :step=900000
      />
    </div>

    <div class="separator q-px-md" v-show="$q.screen.gt.sm">
      <span class="label">13:30 - 15:30</span>
      <span class="ligne"></span>
    </div>

    <div class="slider">
      <span class="label">APRÈS-MIDI</span>
      <q-slider
        v-model="soir"
        color="secondary"
        markers
        snap
        :label-value="new Date(soir).toLocaleTimeString().slice(0, 5)"
        label-always
        switch-label-side
        track-color="grey-5"
        selection-color="B91056"
        :min=soirMinDate
        :max=soirMaxDate
        :step=900000
      />
    </div>

    <div class="toggle-pause">
      <q-toggle
        v-model="pauseSoir"
        color="secondary"
        label="Pause 15h"
        size="xs"
      />
    </div>
  </div>

  <q-card class="tableau-resume" :class="{mobile: $q.screen.lt.sm}">
    <table v-if="$q.screen.gt.sm">
      <tr>
        <th>Déb. journée</th>
        <th>Déb. pause</th>
        <th>Fin pause</th>
        <th>Fin journée</th>
        <th>Tot. AM</th>
        <th>Tot. PM</th>
        <th>Tot.</th>
        <th class="bg-positive text-white" :class="{'bg-negative': this.heuresSup.date[0] === '-' }">Sup.</th>
      </tr>

      <tbody>
      <tr>
        <td>{{formatTime(this.matin)}}</td>
        <td>{{formatTime(this.midi.min)}}</td>
        <td>{{formatTime(this.midi.max)}}</td>
        <td>{{formatTime(this.soir)}}</td>
        <td>{{this.heuresMatin.date}}</td>
        <td>{{this.heuresSoir.date}}</td>
        <td>{{this.heuresTotal.date}}</td>
        <td class="bg-positive text-white" :class="{'bg-negative': this.heuresSup.date[0] === '-' }">{{this.heuresSup.date}}</td>
      </tr>
      </tbody>
    </table>

    <table class="mobile" v-else>
      <tr>
        <th>Début journée</th>
        <td>{{formatTime(this.matin)}}</td>
      </tr>
      <tr>
        <th>Début pause 12h</th>
        <td>{{formatTime(this.midi.min)}}</td>
      </tr>
      <tr>
        <th>Fin pause 12h</th>
        <td>{{formatTime(this.midi.max)}}</td>
      </tr>
      <tr>
        <th>Fin journée</th>
        <td>{{formatTime(this.soir)}}</td>
      </tr>
      <tr>
        <th>Heures matin</th>
        <td>{{this.heuresMatin.date}}</td>
      </tr>
      <tr>
        <th>Heures après-midi</th>
        <td>{{this.heuresSoir.date}}</td>
      </tr>
      <tr>
        <th>Total</th>
        <td>{{this.heuresTotal.date}}</td>
      </tr>
      <tr>
        <th class="bg-positive text-white" :class="{'bg-negative': this.heuresSup.date[0] === '-' }">Sup.</th>
        <td class="bg-positive text-white" :class="{'bg-negative': this.heuresSup.date[0] === '-' }">{{this.heuresSup.date}}</td>
      </tr>
    </table>
  </q-card>

</template>

<script>

import {numPad} from "src/functions/numPadding";
import horaire from "src/data/horaires.json"
let horaires = horaire.horaires;

let today = new Date().getFullYear() + "-" + numPad(new Date().getMonth()) + "-" + numPad(new Date().getDate());

const HEURE = 3600000;
const DEMI_HEURE = 1800000;
const QUART_HEURE = 900000;

export default {
  name: "pageAccueil",
  methods: {
    numPad,

    formatTime(unix) {
      return new Date(unix).toLocaleTimeString().slice(0, 5);
    },

    checkMaxTempsPause(e) {
      if(this.midi.min === this.midi.max) {
        if(this.midi.min === this.midiMinDate) {
          this.midi.max += DEMI_HEURE;
        } else if (this.midi.min === this.midiMinDate + QUART_HEURE) {
          this.midi.min -= QUART_HEURE;
          this.midi.max += QUART_HEURE;
        } else {
          this.midi.min -= DEMI_HEURE;
        }
      } else if (this.midi.min === this.midi.max - QUART_HEURE) {
        if(this.midi.min === this.midiMinDate) {
          this.midi.max += QUART_HEURE;
        } else {
          this.midi.min -= QUART_HEURE;
        }
      }
    }
  },

  computed: {
    heuresMatin() {
      let unixHeuresMatin = this.midi.min - this.matin - 3600000
      return {
        unix: unixHeuresMatin,
        date: new Date(unixHeuresMatin).toLocaleTimeString().slice(0, 5)
      }
    },

    pauseMidi() {
      let unixPauseMidi = this.midi.max - this.midi.min - 3600000
      return {
        unix: unixPauseMidi,
        date: new Date(unixPauseMidi).toLocaleTimeString().slice(0, 5)
      }
    },

    heuresSoir() {
      let unixHeuresSoir = this.soir - this.midi.max - 3600000

      if(this.pauseSoir) {
        unixHeuresSoir -= QUART_HEURE;
      }

      return {
        unix: unixHeuresSoir,
        date: new Date(unixHeuresSoir).toLocaleTimeString().slice(0, 5)
      }
    },

    heuresTotal() {
      let unixHeuresTotal = this.heuresMatin.unix + this.heuresSoir.unix + 3600000;
      return {
        unix: unixHeuresTotal,
        date: new Date(unixHeuresTotal).toLocaleTimeString().slice(0, 5)
      }
    },

    heuresSup() {
      let refDate = new Date(0);
      refDate.setHours(7, 30)

      let signe = ""
      if(this.heuresTotal.unix < refDate) {
        signe = "-"
      } else if (this.heuresTotal.unix > refDate) {
        signe = "+"
      }

      let unixHeuresSup = Math.abs(refDate.getTime() - this.heuresTotal.unix) - 3600000;


      return {
        unix: unixHeuresSup,
        date: signe + new Date(unixHeuresSup).toLocaleTimeString().slice(0, 5)
      }
    }
  },

  data() {
    return {
      matinMinDate: new Date(`1970-01-01T${horaires.matin.debut}`).getTime(),
      matinMaxDate: new Date(`1970-01-01T${horaires.matin.fin}`).getTime(),
      matin: 0,

      midiMinDate: new Date(`1970-01-01T${horaires.midi.debut}`).getTime(),
      midiMaxDate: new Date(`1970-01-01T${horaires.midi.fin}`).getTime(),
      midi: {min: 0, max: 0},

      soirMinDate: new Date(`1970-01-01T${horaires.soir.debut}`).getTime(),
      soirMaxDate: new Date(`1970-01-01T${horaires.soir.fin}`).getTime(),
      soir: 0,

      pauseSoir: false,
    }
  },

  mounted() {
    this.matin = this.matinMinDate

    this.midi = {
      min: this.midiMinDate,
      max: this.midiMaxDate,
    }

    this.soir = this.soirMinDate;
  }
}
</script>

<style scoped lang="scss">
.slider-container {

  margin-inline: 150px;

  &.mobile {
    margin-inline: 30px;
  }

  .label {
    left: 0;
    right: 0;
    top: -16px;
    position: absolute;
    width: 100%;
    text-align: center;
    outline-offset: -1;
    height: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: -200;
  }

  .slider {
    flex: 3;
    position: relative;
    z-index: 200;

    display: flex;
    flex-direction: column;
    justify-content: space-between;


    &:nth-child(3) {
      flex: 6;
    }
  }

  .separator {
    flex: 2;
  }

  .separator {
    position: relative;
    z-index: 100;

    .label {
      border-left: 2px solid darkgray;
      border-right: 2px solid darkgray;
    }

    .ligne {
      position: absolute;
      right: -1px;
      left: -1px;
      bottom: 14px;
      height: 4px;
      background-color: #B91056;
      display: block;
    }
  }

  .toggle-pause {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media screen and (max-width: 1023.99px) {

    flex-direction: column;

    &>div {
      flex: 1;
      margin-bottom: 50px;

      &.toggle-pause {
        margin-bottom: 0;
      };
    }
  }
}

.tableau-resume {
  margin-inline: 150px;

  &.mobile {
    margin-inline: 30px;
  }

  overflow: hidden;

  table {
    border-collapse: collapse;
    width: 100%;

    tr {
      display: flex;

      th {
        padding: 12px 0 6px;
      }

      td {
        padding: 6px 0 12px;
      }

      th, td {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        border-left: 1px solid #f1f1f1;
        border-right: 1px solid #f1f1f1;

        &:first-child {
          border-left: none;
        }

        &:last-child {
          border-right: none;
        }
      }
    }
  }
}
</style>
