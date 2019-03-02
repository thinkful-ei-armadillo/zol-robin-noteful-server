
TRUNCATE noteful_notes, noteful_folders RESTART IDENTITY CASCADE; 

INSERT INTO noteful_folders (folder_name)
VALUES 
    ('important'),
    ('super'),
    ('spangly');

INSERT INTO noteful_notes (note_name, modified_date, content, folder_id)
VALUES 
    ('Dogs', now(), 'we love dogs', 1),
    ('Cats', now(), 'Dogs are better than cats', 1),
    ('Horse', now(), 'Horses are awesome', 2);