class CreatePageBlocks < ActiveRecord::Migration
  def self.up
    create_table :page_blocks do |t|
      t.string  :controller
      t.string  :view
      t.string  :tag
      t.string  :description
      t.text    :html
      t.timestamps
    end

    add_index :page_blocks, [:controller, :view]

    populate
  end

  def self.down
    remove_index :page_blocks, [:controller, :view]
    drop_table :page_blocks
  end

  # display blocks on each screen
  # if the user is an admin, add an edit help link to the display
  def self.populate
    make_block "account", "login", "Account Login Help", "right", ACCOUNT_LOGIN
    make_block "account", "signup", "Account Sign-up Help", "right", ACCOUNT_SIGNUP

    make_block "admin", "edit_user", "Admin Edit User Help"
    make_block "admin", "error_list", "Admin Error List Help", "top"
    make_block "admin", "interaction_list", "Admin Interaction List Help", "top"
    make_block "admin", "session_list", "Admin Session List Help", "top"
    make_block "admin", "tail_logfile", "Admin Tail Logfile Help", "top"

    make_block "article", "edit", "Article Edit Help"
    make_block "article", "graph", "Article Graph Help"
    make_block "article", "list", "Article List Help"
    make_block "article", "show", "Article Display Help"

    make_block "article_version", "show", "Article Version Display Help"
    make_block "article_version", "list", "Article Version List Help"

    make_block "category", "manage", "Category Management Help"

    make_block "collection", "edit", "Collection Editing Help"
    make_block "collection", "new", "Collection Creation Help"
    make_block "collection", "show", "Collection Viewing Help"

    make_block "dashboard", "main_dashboard", "Dashboard Help (Left Side)", "left"
    make_block "dashboard", "main_dashboard", "Dashboard Help (Right Side)"

    make_block "deed", "list", "Deed (User Activity) List Help"

    make_block "display", "display_page", "Single Page Reading Help (Left Side)", "left"
    make_block "display", "display_page", "Single Page Reading Help (Right Side)"
    make_block "display", "list_pages", "Work Table of Contents Help"
    make_block "display", "search", "Search Help"

    make_block "ia", "import_work", "Internet Archive Import Book Help"
    make_block "ia", "manage", "Internet Archive Manage Book Help", 'right', IA_MANAGE

    make_block "oai", "record_list", "OAI Record List Help"
    make_block "oai", "repository_list", "OAI Repository List Help"
    make_block "oai", "set_list", "OAI Set List Help"

    make_block "page", "edit", "Single Page Settings Help", "right", PAGE_EDIT
    make_block "page", "new", "Single Page Creation Help"
    make_block "page", "image_tab", "Single Page Image Help"

    make_block "page_block", "list", "Page Block List Help", "right", PAGE_BLOCK_LIST
    make_block "page_block", "edit", "Page Block Edit Help", 'right', PAGE_BLOCK_EDIT

    make_block "page_version", "list", "Single Page Version List Help"
    make_block "page_version", "show", "Single Page Version Display Help"

    make_block "static", "splash", "Splash Page Left Block", "left", STATIC_SPLASH_LEFT
    make_block "static", "splash", "Splash Page Right Block", "right", STATIC_SPLASH_RIGHT

    make_block "transcribe", "assign_categories", "Assign Categories Help (Left Side)", "left", TRANSCRIBE_ASSIGN_CATEGORIES
    make_block "transcribe", "assign_categories", "Assign Categories Help (Right Side)"
    make_block "transcribe", "display_page", "Transcription Page Help (Right Side)"
    make_block "transcribe", "display_page", "Transcription Page Help (Left Side)", "left"

    make_block "user", "profile", "User Profile View Help"
    make_block "user", "update_profile", "User Profile Edit Help"
    make_block "user", "versions", "User Edit List Help"

    make_block "work", "edit", "Work Settings Help", "right", WORK_EDIT
    make_block "work", "new", "Work Creation Help"
    make_block "work", "pages_tab", "Work Page List Help"
    make_block "work", "scribes_tab", "Work Access Help"
    make_block "work", "show", "Work About Help"
    make_block "work", "versions", "Work Versions Help"

  end

  def self.make_block(controller, view, description, tag="right", default=nil)
    pb = PageBlock.new
    pb.controller=controller
    pb.view=view
    pb.tag=tag
    pb.description=description
    pb.html=default
    pb.save!
  end

  PAGE_BLOCK_LIST = <<PAGEBLOCKLIST
<p>Edit a page block to customize the HTML to be displayed to users viewing that page.</p>
PAGEBLOCKLIST

 PAGE_BLOCK_EDIT =<<PAGEBLOCKEDIT
<p>Enter HTML code to be displayed whenever users view this page</p>
PAGEBLOCKEDIT

  IA_MANAGE = <<IAMANAGE
		<p>
			This page displays a book that has been imported from the Internet Archive
			but has not yet been converted to a FromThePage work.
		</p>
		<p>
		  For more information on this screen, see the Wiki article
		  <a href="https://github.com/benwbrum/fromthepage/wiki/Importing-Works-from-the-Internet-Archive">
		    Importing Works from the Internet Archive
		  </a>.
		</p>
		<dl>
		    <dt>
		      Retitle from OCR
		    </dt>
		    <dd>
		      This replaces the Archive.org page numbers with the first line of OCR text
			  on each page.  This is useful for diaries and daybooks, since the first line
			  is generally a date.  This process will take several minutes to run, since
			  it requires parsing the entire OCR text for the book and updating each page
			  number.  After the book has been converted to a FromThePage work, you will
			  be able to correct any page titles.

		    </dd>
		    <dt>
		      Purge Delete Scans
		    </dt>
		    <dd>
			  Some leaves in an Archive.org scan are used for color calibration and never
			  displayed.  Archive.org marks these as type <i>Delete</i>.  Purging these
			  will remove these leaves from the work and prevent the need to manually
			  delete them later.
		    </dd>
		    <dt>
		      Convert to FromThePage
		    </dt>
		    <dd>
		      Once you've got titles and leaves ready, this button will convert the book
			  to a ready-to-transcribe FromThePage work.  This process will take several
			  minutes to run.
		    </dd>
		  </dl>
IAMANAGE

  ACCOUNT_LOGIN = <<ACCOUNTLOGIN
      <p>
        Welcome back to FromThePage!
      </p>
      <p>
        If you don't have an account yet and wish to transcribe works, please
        <%= link_to("sign up",
                    { :controller => 'account',
                      :action => 'signup' } )%>.
      </p>
ACCOUNTLOGIN

  ACCOUNT_SIGNUP = <<ACCOUNTSIGNUP
      <dl>
        <dt>
          Login
        </dt>
        <dd>
          Choose the user name you'll want to login as.
        </dd>
        <dt>
          Password
        </dt>
        <dt>
          Confirm Password
        </dt>
        <dd>
          Re-type your password to make sure you typed the one you want.
          No cut-and-paste -- that's cheating!
        </dd>
        <dt>
          Screen Name
        </dt>
        <dd>
           Choose a name to be displayed on the website.  People will see this when
           they look at your comments and contributions.
        </dd>
        <dt>
          Real Name
        </dt>
        <dt>
          Email
        </dt>
        <dd>
          We currently do nothing with this.
        </dd>
        <dt>
          What's that funny image thing?
        </dt>
        <dd>
          We're trying to make sure you're a real person, rather than a spambot.  Don't
          forget to use upper or lower case just like the image displays.
        </dd>
      </dl>
ACCOUNTSIGNUP

  PAGE_EDIT = <<PAGEEDIT
      <p>
        The settings for this page are only accessible to the work owner.  Hover over the title field and click the text to edit it.
      </p>
PAGEEDIT

  STATIC_SPLASH_LEFT = <<STATICSPLASHLEFT
  <div class="splash-block">

<h3>What is Transc&amp;Anno?</h3>

<p>
Transc&amp;Anno is free software that allows to transcribe and annotate scanned documents on-line. Because Transc&amp;Anno runs in your Firefox browser, you can read and transcribe materials from anywhere. The resulting text is hosted on the web, making documents easy to read and search. It was created by slightly modifying an open-source transcription tool FromThePage.
</p>

<p>
<b>Features of Transc&Anno include:</b>
  <ul>
    <li><b>Intuitive transcription and annotation environment:</b> Users add or edit transcriptions on one side of the screen while viewing a scanned image of the manuscript page on the other side.
    </li>
    <li><b>Version Control:</b> Changes to each page transcription are recorded and may be viewed to follow the edit history of a page.
    </li>
    <li><b>Presentation:</b>  Readers can view transcriptions in a multi-page format or alongside page images.
    </li>
    </ul>
</p>
</div>
STATICSPLASHLEFT





  STATIC_SPLASH_RIGHT = <<STATICSPLASHRIGHT
<div class="splash-block">
<h3>How do I get started?</h3>
<p>
<b>Start reading: </b>
</p>
<p>
See <a href="https://github.com/benwbrum/fromthepage/wiki/Your-First-User-and-Collection">Your First User and Collection</a> on FromThePage wiki.

<a href="https://github.com/benwbrum/fromthepage/wiki/Preparing-a-Work-for-Transcription">Preparing a Work For Transcription</a> also has good information on how to get works into Transc&amp;Anno.
</p>
</div>

STATICSPLASHRIGHT


  TRANSCRIBE_ASSIGN_CATEGORIES = <<ASSIGNCATEGORIES
      <p>
        Assign categories to the subjects mentioned in this page:
      </p>
ASSIGNCATEGORIES


  WORK_EDIT = <<WORKEDIT
      <p>
        The settings for this work are only accessible to the work owner.  Hover over the description fields and click text to edit them.
      </p>
      <p>
  For more information on work settings, see the wiki article
  <a href="https://github.com/benwbrum/fromthepage/wiki/Preparing-a-Work-for-Transcription">Preparing a Work for Transcription</a>.
      </p>
WORKEDIT
end
