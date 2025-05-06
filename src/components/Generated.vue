<script setup lang="ts">
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { onMounted, ref } from 'vue';
import { useMainData } from '@/stores/mainDataStore.ts'

const pdfUrl = '/pdf.pdf';
const editedPdfUrl = ref('');

const mainDataStore = useMainData();

const loadAndEditPDF = async () => {
  const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);
  const fontBytes = await fetch('Roboto-Regular.ttf').then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);


  const page = pdfDoc.getPages()[0];
  console.log(page.getHeight())

  // You may need to adjust X/Y depending on your table position
  // Draw organizer
  page.drawText(mainDataStore.tempStorage.gameInfo.organizer, {
    ...getCords(31, 38),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.games, {
    ...getCords(31, 45),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.place, {
    ...getCords(31, 53),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.place, {
    ...getCords(31, 53),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.date, {
    ...getCords(26, 61),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.game_number.toString(), {
    ...getCords(74, 61),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.start.toString(), {
    ...getCords(27, 68),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });
  page.drawText(mainDataStore.tempStorage.gameInfo.end.toString(), {
    ...getCords(71, 68),
    size: 10,
    font,
    color: rgb(0, 0, 0)
  });

  // TEAMS
  page.drawText(mainDataStore.tempStorage.hostTeam.name, {
    ...getCords(124, 19),
    size: 8,
    font,
    color: rgb(0, 0, 0)
  });
  mainDataStore.tempStorage.hostTeam.players.forEach((player, index) => {
    if(index > 19){
      return;
    }
    page.drawText(player.name, {
      ...getCords(113, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    page.drawText(player.number.toString(), {
      ...getCords(107, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    page.drawText(player.license, {
      ...getCords(166, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    if(player.capitan){
      page.drawText("K", {
        ...getCords(101, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
    }
    if(player.goalkeeper){
      page.drawText("B", {
        ...getCords(98.5, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
    }
  })

  page.drawText(mainDataStore.tempStorage.guestTeam.name, {
    ...getCords(124, 111.5),
    size: 8,
    font,
    color: rgb(0, 0, 0)
  });
  mainDataStore.tempStorage.guestTeam.players.forEach((player, index) => {
    if(index > 19){
      return;
    }
    page.drawText(player.name, {
      ...getCords(113, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    page.drawText(player.number.toString(), {
      ...getCords(107, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    page.drawText(player.license, {
      ...getCords(166, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
      size: 7,
      font,
      color: rgb(0, 0, 0)
    });
    if(player.capitan){
      page.drawText("K", {
        ...getCords(101, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
    }
    if(player.goalkeeper){
      page.drawText("B", {
        ...getCords(98.5, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
    }
  })

  // Goals

  mainDataStore.tempStorage.hostTeam.goals.forEach((goal, index) => {
    if(index >= 25){
      return;
    }
    if (index <= 19){
      page.drawText((index + 1).toString(), {
        ...getCords(187, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.time.toString(), {
        ...getCords(197, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.playerId?.toString(), {
        ...getCords(210, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      if(goal.assistId){
        page.drawText(goal.assistId.toString(), {
          ...getCords(219, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
      if(goal.code){
        page.drawText(goal.code.toString(), {
          ...getCords(229, 28+ (3.9 * index - (index > 2 ? 0.7 : 0) - (index > 13 ? 1.2 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }else{
      const index2 = index - 20;
      page.drawText((index + 1).toString(), {
        ...getCords(240, 28+ (3.9 * index2 - (index2 > 2 ? 0.7 : 0) - (index2 > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.time.toString(), {
        ...getCords(250, 28+ (3.9 * index2 - (index2 > 2 ? 0.7 : 0) - (index2 > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.playerId?.toString(), {
        ...getCords(260, 28+ (3.9 * index2 - (index2 > 2 ? 0.7 : 0) - (index2 > 13 ? 1.2 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      if(goal.assistId){
        page.drawText(goal.assistId.toString(), {
          ...getCords(270, 28+ (3.9 * index2 - (index2 > 2 ? 0.7 : 0) - (index2 > 13 ? 1.2 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
      if(goal.code){
        page.drawText(goal.code.toString(), {
          ...getCords(280, 28+ (3.9 * index2 - (index2 > 2 ? 0.7 : 0) - (index2 > 13 ? 1.2 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }
  })
  mainDataStore.tempStorage.guestTeam.goals.forEach((goal, index) => {
    if(index >= 25){
      return;
    }
    if (index <= 19) {
      page.drawText((index + 1).toString(), {
        ...getCords(187, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.time.toString(), {
        ...getCords(197, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.playerId?.toString(), {
        ...getCords(210, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      if(goal.assistId){
        page.drawText(goal.assistId.toString(), {
          ...getCords(219, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
      if(goal.code){
        page.drawText(goal.code.toString(), {
          ...getCords(229, 119.5+ (3.9 * index - (index > 2 ? 0.1 : 0) - (index > 11 ? 1.5 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }else{
      const index2 = index - 20;
      page.drawText((index + 1).toString(), {
        ...getCords(240, 119.5+ (3.9 * index2 - (index2 > 2 ? 0.1 : 0) - (index2 > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.time.toString(), {
        ...getCords(250, 119.5+ (3.9 * index2 - (index2 > 2 ? 0.1 : 0) - (index2 > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      page.drawText(goal.playerId?.toString(), {
        ...getCords(260, 119.5+ (3.9 * index2 - (index2 > 2 ? 0.1 : 0) - (index2 > 11 ? 1.5 : 0))),
        size: 7,
        font,
        color: rgb(0, 0, 0)
      });
      if(goal.assistId){
        page.drawText(goal.assistId.toString(), {
          ...getCords(270, 119.5+ (3.9 * index2 - (index2 > 2 ? 0.1 : 0) - (index2 > 11 ? 1.5 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
      if(goal.code){
        page.drawText(goal.code.toString(), {
          ...getCords(280, 119.5+ (3.9 * index2 - (index2 > 2 ? 0.1 : 0) - (index2 > 11 ? 1.5 : 0))),
          size: 7,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }

  })

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  editedPdfUrl.value = URL.createObjectURL(blob);
};
const getCords = (xMm: number, yMm: number): { x: number, y: number } => {
  const mmToPt = (mm: number) => mm * 2.83465;
  const pageHeightPt = 595.32;

  return {
    x: mmToPt(xMm),
    y: pageHeightPt - mmToPt(yMm),
  };
};
onMounted(() => {
  loadAndEditPDF();
});
</script>
<template>
    <iframe v-if="editedPdfUrl" :src="editedPdfUrl"></iframe>
</template>

<style scoped>
  iframe{
    height: 100dvh;
    width: 100%;
  }
</style>
