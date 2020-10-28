export default function() {

  let x=sessionStorage.getItem('type');
  console.log(x + ' from data');
  if (x==0)
  return [


    {
      title: "Utilisateurs",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/clients",
    },
    {
      title: "Fournisseurs",
      to: "/fournisseurs",
      htmlBefore: '<i class="material-icons">view_module</i>',
      htmlAfter: ""
    },
    {
      title: "Bons",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/bon",
    },
    {
      title: "Encaisser",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/caisse",
    },
    {
      title: "Déconnecter",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/login",
    },


  ];
  if (x==1)
  return [



    {
      title: "Bons",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/bon",
    },
    {
      title: "Encaisser",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/caisse",
    },
    {
      title: "Déconnecter",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/login",
    },
  ]
  if (x==2)
  return [
    {
      title: "Encaisser",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/caisse",
    },
    {
      title: "Déconnecter",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/login",
    },
  ]
}
