const { notify } = require("../../routes");

class PostComments {
  constructor(postId) {
    this.postId = postId;
    this.postContainer = $(`#podt-${postId}`);
    this.newCommentForm = $(`#post-${postId}-comments-form`);

    this.createComment(postId);

    let self = this;
    //call for all the existing comments
    $(` .delete-comment-button`, this.postContainer).each(function () {
      self.deleteComment($(this));
    });
  }
  createComment(postId) {
    let pSelf = this;
    this.newCommentForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      $.ajax({
        type: 'post',
        url: '/comments/create',
        data: $(self).serialize(),
        success: function (data) {
          let newComment = pSelf.newCommentDom(data.data.comment);
          $(`#post-comments-${postId}`).prepend(newComment);
          pSelf.deleteComment($(` .delete-comment-button`, newComment));

          new notify({
            theme: 'relax',
            text: "Comment Published",
            type: 'success',
            layout: 'topRight',
            timeout: 1500
          }).show();
        }, error: function (error) {
          console.log(error.responseText);
        }
      })
    })
  }

  newCommentDom(comment) {
    return $(`<li id="comment-${comment._id}">
      <p>
<small>
  <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
</small>
${comment.content}
<br>
<small>
${comment.user.name}
</small>
      </p>
     </li>` )
  }


  deleteComment(deleteLink) {
    $(deleteLink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: 'get',
        url: $(deleteLink).prop('href'),
        success: function (data) {
          $(`#comment-${data.data.coment_id}`).remove();
          new Noty({
            theme: 'relax',
            text: "Comment Deleted",
            type: 'success',
            layout: 'topRight',
            timeout: 1500

          }).show();

        }, error: function (error) {
          console.log(error.responseText);
        }
      });
    });
  }
}