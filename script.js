const items = document.querySelectorAll(".accordion button");

function toggleAccordion() {
  const itemToggle = this.getAttribute('aria-expanded');
  
  for (i = 0; i < items.length; i++) {
    items[i].setAttribute('aria-expanded', 'false');
  }
  
  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}

items.forEach(item => item.addEventListener('click', toggleAccordion));


$(function()
{
    $('#contact-form').submit(function(e)//Lorque l' on soumet(bouton submit) contact-form alors il se passe ce qu il y a dans cette fonction event
    {   //prevent default: je veux avec le POST pouvoir changer ce qu il y a dans mon #contact-form
        e.preventDefault();// enleve le comportement par defaut (le defaut étant de passer par une autre page là je ne veux pas)
        $('.comments').empty();// remettre tout les comments à 0 lors du submit
        var postdata = $('#contact-form').serialize();//prends tout les infos qui sont dans #contact-form et les mettre dans la var postdata
        //partie AJAX
            //On prend les infos de notre formulaire
            //On les envoie à un fichier externe de PHP
            //Qui va traiter ces infos
            //Nous renvoyer de l' information
            //Et avec ce resultat de l'information on va mettre à jour les élements html et css
            //Dans le meme page (celle du #contact-form)
                //Affichage
        $.ajax({
            type: 'POST',
            url: 'php/contact.php',
            data: postdata,
            dataType: 'json',
            success: function (result) 
            {
                if(result.isSuccess) // si le resultat de isSuccess est true
                {
                    //je rajoute append la phrase de remerciement
                    $("#contact-form").append("<p class='thank-you'>Votre message à bien été envoyé, merci de m'avoir contacté  :-)</p>");
                    // je fais un reset de tout les élément du #contact-form ( string = "")
                    $("#contact-form")[0].reset();
                }
                else
                {
                    // la je sélectionne avec + le comment qui faitparti de #fistName et je mets dans le html le resuktat.firstNameError
                    $("#firstName + .comments").html(result.firstNameError);
                    $("#name + .comments").html(result.nameError);
                    $("#email + .comments").html(result.emailError);
                    $("#phone + .comments").html(result.phoneError);
                    $("#message + .comments").html(result.messageError);
                }   
            }
        });
    })
})

