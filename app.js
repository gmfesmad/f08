function subscribeUser() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (reg) {
            reg.pushManager.subscribe({
                userVisibleOnly: true
            }).then(function (sub) {
                console.log('Endpoint URL: ', sub.endpoint);
            }).catch(function (e) {
                if (Notification.permission === 'denied') {
                    console.warn('Permission for notifications was denied');
                } else {
                    console.error('Unable to subscribe to push', e);
                }
            });
        })
    }
}
subscribeUser();

let homeGoals = 0;
let awayGoals = 0;
let homeFouls = 0;
let awayFouls = 0;

function updateDisplay() {
    document.getElementById('score').textContent = `${homeGoals} x ${awayGoals}`;
    document.getElementById('fouls').textContent = `Home: ${homeFouls}, Away: ${awayFouls}`;
}

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
    });
}

function sendNotification(message) {
    if (Notification.permission === 'granted') {
        new Notification(message, { body: "test" });
    } else if (Notification.permission !== 'denied') {
        requestNotificationPermission().then(() => {
            if (Notification.permission === 'granted') {
                new Notification(message, { body: "test" });
            }
        });
    }
}

function addGoal(team) {
    if (team === 'home') {
        homeGoals++;
    } else {
        awayGoals++;
    }
    updateDisplay();
    sendNotification('New goal scored! Score is now ' + `${homeGoals} x ${awayGoals}`);
}

function addFoul(team) {
    if (team === 'home') {
        homeFouls++;
    } else {
        awayFouls++;
    }
    updateDisplay();
}

function shareScore() {
    if (navigator.share) {
        navigator.share({
            title: 'Score',
            text: `Current score: ${homeGoals} x ${awayGoals}`,
        }).catch(error => {
            console.error('Error while sharing:', error);
        });
    } else {
        alert('Web Share API not supported.');
    }
}

// Request permission when the page loads
document.addEventListener('DOMContentLoaded', requestNotificationPermission);

setTimeout(() => {
    sendNotification("Teste");
    console.log("Notification criada");
}, 3000);

updateDisplay();
