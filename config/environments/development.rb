Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # action mailer config -- required for password resets and the bulk uploader
    config.action_mailer.smtp_settings = {
    :address   => "outlook.office365.com",
    :port      => 587, # ports 587 and 2525 are also supported with STARTTLS
    :enable_starttls_auto => true, # detects and uses STARTTLS
    :user_name => "nokinina@eurac.edu",
    :password  => "zahodite_gosti_dorogie",
    :authentication => 'login', 
    :domain => 'office365.com', # your domain to identify your server when connecting
  }
  config.action_mailer.default_url_options =  { host: 'localhost:3001' } #change this to match your server URL, i.e. www.fromthepage.com
  config.action_mailer.default_options
  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true
  
  # http://pontiiif.brumfieldlabs.com/api/v0.0/search/Irish
  config.pontiiif_server = 'http://pontiiif.brumfieldlabs.com/'

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  # location of system calls on this machine
  NEATO = '/usr/bin/neato'
  RAKE = '/usr/bin/env rake'
end
